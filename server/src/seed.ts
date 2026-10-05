import { prisma } from "./lib/prisma.js";

const rooms = [
  {
    name: "Deluxe King Room",
    description:
      "A spacious king room designed for comfort, featuring a premium bed, lounge area, workspace, and elegant bathroom.",
    price: 85000,
    capacity: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    name: "Executive Suite",
    description:
      "An elegant suite with a separate living area, king-size bed, refined interior finishes, and generous space for longer stays.",
    price: 145000,
    capacity: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },
  {
    name: "Family Suite",
    description:
      "A comfortable family-focused suite with additional sleeping space, a lounge area, and enough room for parents and children.",
    price: 180000,
    capacity: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  },
  {
    name: "Presidential Suite",
    description:
      "Our signature luxury suite featuring expansive living spaces, premium furnishings, exceptional privacy, and an elevated hotel experience.",
    price: 350000,
    capacity: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
  },
];

async function seed() {
  console.log("Seeding Haven Hotel database...");

  await prisma.room.deleteMany();

  await prisma.room.createMany({
    data: rooms,
  });

  console.log("Rooms seeded successfully.");
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });