/*
 * @Author: wqsong2
 * @Date: 2025/2/7 17:46
 * @Desciption:
 */
const req = require.context('./svg', false, /\.svg$/);
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
requireAll(req);
