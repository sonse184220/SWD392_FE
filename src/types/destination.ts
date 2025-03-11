// export type Author = {
//   name: string;
//   image: string;
//   bio?: string;
//   _id?: number | string;
//   _ref?: number | string;
// };

// export type Blog = {
//   _id: number;
//   title: string;
//   slug?: any;
//   metadata?: string;
//   body?: string;
//   mainImage?: any;
//   author?: Author;
//   tags?: string[];
//   publishedAt?: string;
// };

export type Destination = {
  destinationId: number;
  destinationName: string;
  address: string;
  description: string;
  rate: number;
  categoryId: number;
  ward: string;
  status: string;
  districtId: number;
  district: {
    districtId: number;
    name: string;
    description: string;
    cityId: number;
    city: {
      cityId: number;
      name: string;
      description: string;
    };
  };
};
