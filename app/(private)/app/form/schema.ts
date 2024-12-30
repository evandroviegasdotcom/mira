import { z } from "zod"

const schema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().min(10).max(100).optional()
})

export default schema