import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('--- Buscando AvailabilityBlocks de reservas no confirmadas ---');
  const blocks = await prisma.availabilityBlock.findMany({
    where: {
      reason: { startsWith: 'BOOKING_' },
    },
  });
  console.log(`Encontrados ${blocks.length} bloques de reservas.`);

  for (const block of blocks) {
    const code = block.reason ? block.reason.replace('BOOKING_', '').trim() : '';
    const booking = code ? await prisma.booking.findUnique({ where: { code } }) : null;

    console.log(`Bloque ${block.id} (${block.startDate.toISOString().slice(0, 10)} - ${block.endDate.toISOString().slice(0, 10)}), code: ${code}, booking status: ${booking ? booking.status : 'NO_EXISTE'}`);

    // Si la reserva no existe, o está cancelada, rechazada, o sigue pendiente sin pago
    if (!booking || ['CANCELLED', 'OWNER_REJECTED', 'REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status)) {
      console.log(`-> Eliminando bloque ${block.id} porque la reserva ${code} está en estado: ${booking?.status || 'NO_EXISTE'}`);
      await prisma.availabilityBlock.delete({
        where: { id: block.id },
      });
      if (booking && ['REQUESTED', 'OWNER_ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status)) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: 'CANCELLED' },
        });
        console.log(`-> Reserva ${booking.code} marcada como CANCELLED.`);
      }
    }
  }

  console.log('--- Limpieza completada con éxito ---');
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
