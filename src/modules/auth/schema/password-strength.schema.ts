export const getPasswordStrength = (password: string) => {
if (!password) return { strength: 0, label: "", color: "bg-gray-300" };

let strength = 0;
if (password.length >= 8) strength++;
if (/[A-Z]/.test(password)) strength++;
if (/[a-z]/.test(password)) strength++;
if (/[0-9]/.test(password)) strength++;
if (/[^A-Za-z0-9]/.test(password)) strength++;

const labels = ["Molto debole", "Debole", "Discreta", "Buona", "Forte"];
const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

return {
    strength,
    label: labels[strength - 1] || "",
    color: colors[strength - 1] || "bg-gray-300",
};
};