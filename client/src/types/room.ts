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

export type AdminRoom = Room & {
  bookingCount: number;
};

export type AdminRoomsResponse = {
  success: boolean;
  count: number;
  rooms: AdminRoom[];
};

export type AdminRoomResponse = {
  success: boolean;
  message?: string;
  room: AdminRoom;
};

export type UploadRoomImageResponse = {
  success: boolean;
  imageUrl: string;
  publicId: string;
};