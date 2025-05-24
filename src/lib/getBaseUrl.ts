const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url;
};

export default getBaseUrl;
