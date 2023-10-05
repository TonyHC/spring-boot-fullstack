import {Customer} from "../types.ts";

export const ageGroupCount = (customers: Customer[], start: number, end?: number): number => {
    if (start && end) {
        return customers.filter(customer => customer.age >= start && customer.age <= end).length;
    } else {
        return customers.filter(customer => customer.age >= start).length;
    }
};

export const getGreeting = (hour: number): string => {
    let greeting: string;

    if (hour >= 5 && hour < 12) {
        greeting = "Morning";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Afternoon";
    } else if (hour >= 18 && hour < 21) {
        greeting = "Evening";
    } else {
        greeting = "Night";
    }

    return greeting;
};