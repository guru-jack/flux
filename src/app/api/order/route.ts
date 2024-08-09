
import { getCurrectUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";



export async function PUT(request: Request) {
    try {
        const currentUser = await getCurrectUser();
        if (!currentUser) {
            console.error("User not found");
            return NextResponse.error();
        }

        if (currentUser.role !== "ADMIN") {
            console.error("Unauthorized access");
            return NextResponse.error();
        }

        const body = await request.json();
        const { id, deliveryStatus } = body;

        console.log("Updating order with ID:", id, "to status:", deliveryStatus);

        const order = await prisma.order.update({
            where: { id: id },
            data: { deliveryStatus },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error during PUT request:", error);
        return NextResponse.error();
    }
}



