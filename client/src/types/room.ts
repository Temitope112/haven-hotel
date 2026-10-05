export type Room = {
  id: number;
  name: string;
  description: string;
  price: string;
  capacity: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RoomsResponse = {
  success: boolean;
  count: number;
  rooms: Room[];
};

export type RoomResponse = {
  success: boolean;
  room: Room;
};