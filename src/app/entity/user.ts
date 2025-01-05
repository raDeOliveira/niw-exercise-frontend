import {Payment} from "./payment";

export interface User {
  name: string;
  email: string;
  paymentDTO: Payment
}
