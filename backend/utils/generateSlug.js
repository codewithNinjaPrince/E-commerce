const normalize = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const generateMerchantSlug = async ({
  storeName,
  city,
  phone,
}) => {
  const base =
    `${normalize(storeName)}-${normalize(city)}-${phone.slice(-4)}`;

  let slug = base;
  let counter = 1;

  while (await merchantModel.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
};
