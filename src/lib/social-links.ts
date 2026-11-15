export const socialLinks = {
  instagram: 'https://www.instagram.com/gtrcars',
  facebook: null,
  tiktok: null,
  youtube: null,
  pinterest: null,
  linkedin: null,
} as const;

export const activeSocialLinks = Object.entries(socialLinks).filter(([, url]) => Boolean(url)) as Array<[keyof typeof socialLinks, string]>;
