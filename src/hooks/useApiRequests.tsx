import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, Method, AxiosError } from "axios";
import { toast } from "sonner";

export const useApiFetch = (
  url: string,
  queryKey?: string[],
  options?: AxiosRequestConfig
) => {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: queryKey || [],
    queryFn: async ({ signal }) =>
      axios.get(url, { ...options, signal, withCredentials: true }),
  });

  // Handle general json message fields from response
  if (data && data.data.message) {
    toast.info(data.data.message);
  }
  // Network errors
  if (error && axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      toast.error("Connection lost!");
    }
    if (error.response?.data.middleware) {
      toast.error(error.response?.data.middleware);
    }
  }
  return { refetch, isPending, data, error: error as AxiosError | any };
};

export const useApiMutate = (
  url: string,
  method: Method,
  invalidateKey?: string[],
  options?: AxiosRequestConfig
) => {
  const queryClient = new QueryClient();
  const { mutate, isPending, data, error } = useMutation({
    mutationFn: (bodyData: any) => {
      return axios({
        method,
        url,
        data: bodyData,
        ...options,
        withCredentials: true,
      });
    },
    onSuccess: (data) => {
      // Handle general json message fields from response
      if (data && data.data.message) {
        toast.info(data.data.message);
      }
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }
    },
    onError: (error) => {
      // Network errors
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          toast.error("Connection lost!");
        }
        if (error.response?.data.middleware) {
          toast.error(error.response?.data.middleware);
        }
      }
    },
  });

  return {
    mutate,
    isPending,
    data,
    error: error as AxiosError | any,
  };
};
