export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    retry: 2,
    retryDelay: 500,

    async onRequest({ options }) {
      options.headers.append('Slr', 'XYZWAYW1AA');
    },
    onResponseError({ response }) {
      if (response._data.error?.code === "9508") {
        navigateTo("/login");
      }
    },
  });

  const publicApi = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    retry: 2,
    retryDelay: 500,
  });

  return {
    provide: {
      api,
      publicApi,
    },
  };
});
