export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
}

export interface Address {
  place: string;
  latitude: string;
  longitude: string;
}

export interface Profile {
  id: string;
  user: User;
  address: Address;
  phone_number: string;
  available: boolean;
  country: string;
  zip_code: string;
  city: string;
  state: string;
}
