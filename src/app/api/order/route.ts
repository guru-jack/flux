import { getCurrectUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma client is imported correctly

export async function PUT(request: Request) {
    try {
        const currentUser = await getCurrectUser();
        if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        if (currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { id, deliveryStatus } = body;

        if (!id || !deliveryStatus) {
            return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
        }

        const orderExists = await prisma.order.findUnique({
            where: { id },
        });

        if (!orderExists) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { deliveryStatus },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
