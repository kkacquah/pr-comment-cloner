import axios from "axios";

export const handleAxiosError = (error: any): never => {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error('Failed to fetch pull requests due to an unexpected error');
    }
  }