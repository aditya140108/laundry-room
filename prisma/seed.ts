import { prisma } from "../lib/prisma";

async function main() {
    await prisma.user.createMany({
        data: [
            {
                userID: 1,
                name: "Alice Johnson",
                email: "alice@example.com",
                bagNo: "BAG001",
            },
            {
                userID: 2,
                name: "Bob Smith",
                email: "bob@example.com",
                bagNo: "BAG002",
            },
            {
                userID: 3,
                name: "Charlie Brown",
                email: "charlie@example.com",
                bagNo: "BAG003",
            },
        ],
    });

    console.log("Seeded successfully!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());