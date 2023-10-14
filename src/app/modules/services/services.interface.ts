import { Districts } from "@prisma/client"

export type IServiceFilterRequest = {
    search?: string,
    minPrice?: string,
    maxPrice?: string,
    category?: string,
    location?: Districts
}
