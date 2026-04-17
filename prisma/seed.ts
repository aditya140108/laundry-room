import { prisma } from "../lib/prisma";

async function main() {
    await prisma.user.createMany({
        data: [
            {
                userID: 1020251111,
                name: "Alice Johnson",
                email: "alice@example.com",
                bagNo: "AA11",
            },
            {
                userID: 1020252222,
                name: "Bob Smith",
                email: "bob@example.com",
                bagNo: "AA22",
            },
            {
                userID: 1020253333,
                name: "Charlie Brown",
                email: "charlie@example.com",
                bagNo: "AA33",
            },
            {
                userID: 1020253333,
                name: "Charlie Brown",
                email: "charlie@example.com",
                bagNo: "AA34",
            },
            {
                userID: 1020254444,
                name: "David Lee",
                email: "david@example.com",
                bagNo: "AA44",
            }
        ],
    });

    console.log("Seeded successfully!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());