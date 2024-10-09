// scr/pages/api/protected.js
import { verifyIdToken } from '../../middleware/auth';

export default function handler(req, res) {
  verifyIdToken(req, res, () => {
    res.status(200).json({ message: 'This is a protected route!', uid: req.user.uid });
  });
}
