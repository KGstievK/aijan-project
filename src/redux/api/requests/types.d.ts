namespace REQUESTS {
  type RequestItem = {
    id: string;
    department: string;
    date: string;
    userId: string;
  };

  type GetResponse = RequestItem[];
  type GetRequest = void;

  type DeleteResponse = { message: string };
  type DeleteRequest = string;
}