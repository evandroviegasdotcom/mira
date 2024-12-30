import { z } from "zod"
 
const status = z.union([z.literal("starting"), z.literal("progress"), z.literal("done")  ])
export const schema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(150),
  dueDate: z.date(),
  status
})
export type TaskStatus = z.infer<typeof status>
export type FormSchema = z.infer<typeof schema>