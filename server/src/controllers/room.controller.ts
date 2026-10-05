import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getRooms(req: Request, res: Response) {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        price: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Failed to fetch rooms:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
}

export async function getRoomById(req: Request, res: Response) {
  try {
    const roomId = Number(req.params.id);

    if (Number.isNaN(roomId)) {
      res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });

      return;
    }

    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      res.status(404).json({
        success: false,
        message: "Room not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Failed to fetch room:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch room",
    });
  }
}