import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function (_: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    name: "Good",
    age: 1,
    isValid: true,
  });
}
