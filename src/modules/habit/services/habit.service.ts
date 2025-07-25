import prisma from "@/prisma";
import { HabitOutput, HabitOutputSchema } from "../schema/HabitOutput.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HabitInput } from "../schema/HabitsInput.schema";
import { HabitCategoryOutput, HabitCategoryOutputSchema } from "../schema/HabitCategoryOutputSchema";
import CreateHabitResponse from "../types/CreateHabitResponse";
// import z from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function createHabit(data: HabitInput): Promise<CreateHabitResponse> {
  try {
    const habit = await prisma.habit.create({ data });

    const validateHabit = HabitOutputSchema.safeParse(habit);

    if (!validateHabit.success) {
      return { success: false, message: "Errore backend validazione abitudine in POST output" };
    }
    return { success: true, data: validateHabit.data };
  } catch (err: unknown) {
    console.error("Errore catturato in createHabit:", err);
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return { success: false, message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso." };
    }
    return { success: false, message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso." };
  }
}

export async function getAllHabits(userId: number): Promise<HabitOutput[] | null> {

    try {
        const habits = await prisma?.habit.findMany({
            where: {
                userId
            }
        })

        if(!habits) return null

        // const normalizedHabits = habits.map(habit => ({
        //     ...habit,
        //     startDate: typeof habit.startDate === 'string' ? habit.startDate : habit.startDate.toISOString(),
        //     endDate: habit.endDate ? (typeof habit.endDate === 'string' ? habit.endDate : habit.endDate.toISOString()) : undefined,
        //     targetValue: habit.targetValue === null ? undefined : habit.targetValue,
        // }));

        const validateHabits = HabitOutputSchema.array().safeParse(habits);

        // if (!validateHabits.success) {
        // console.error(validateHabits.error.format());
        // } else {
        // console.log(validateHabits.data);
        // }
        

        if(!validateHabits.success) {
            console.error("Errore di validazione nella route")
            return null
        }

        return validateHabits.data;

    } catch(err) {
        console.error("Errore backend nel recupero delle abitudini: ", err)
        throw new Error("Errore backend generico nel recupero delle abitudini")
    }

}

export async function getHabit(habitId: number, userId: number): Promise<HabitOutput | null> {

    try {
        const habit = await prisma?.habit.findFirst({
            where: {
                id: habitId,
                userId
            }
        });

        if(!habit) return null

        const validateHabits = HabitOutputSchema.safeParse(habit)

        if(!validateHabits.success) return null

        return validateHabits.data;

    } catch(err) {
        console.error("Errore nel recupero della categoria: ", err)
        throw new Error("Errore generico nel recupero della categoria")
    }

}



export async function getAllHabitsWithCategory(userId: number): Promise<HabitCategoryOutput[] | null> {

    try {

        const habits = await prisma?.habit.findMany({
        where: {
            userId
        },
        include: {
            categoria: true, // include tutti i campi della categoria associata
        },
        })


        if(!habits) return null

        const validateHabits = HabitCategoryOutputSchema.array().safeParse(habits);
        

        if(!validateHabits.success) {
            console.error("Errore di validazione nel backend per habits category")
            return null
        }

        return validateHabits.data;

    } catch(err) {
        console.error("Errore backend nel recupero delle abitudini + categorie: ", err)
        throw new Error("Errore backend generico nel recupero delle abitudini + categorie")
    }

}


export async function deleteHabit(habitId: number, userId: number): Promise<boolean | null> {

    try {
        const habit = await prisma?.habit.delete({
            where: {
                id: habitId,
                userId
            }
        });

        // console.log("Habit backend pre valid: ", habit)

        if(!habit) return null

        // const validateHabit = HabitOutputSchema.safeParse(habit)

        // console.log("Habit backend post valid: ", validateHabit)

        // if(!validateHabit.success) return null

        return true;

    } catch(err) {
        console.error("Errore nell'eliminazione della abitudine + categoria: ", err)
        throw new Error("Errore generico nell'eliminazione della abitudine + categoria")
    }

}


export async function updateHabits(data: any, habitId: number, userId: number): Promise<HabitOutput | null> {
  try {

    const habit = await prisma.habit.update({
        where: {
            id: habitId,
            userId
        },
        data 
    });

    const validateHabit = HabitOutputSchema.safeParse(habit)

    if(!validateHabit.success) return null

    return validateHabit.data;

  } catch (err: unknown) {

    console.error("Errore catturato in updateHabits:", err);
    // Gestione errore Prisma unique constraint
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      // Rilancia direttamente l'errore Prisma per farlo intercettare dalla route
      throw err;
    }
    throw err;
  }
}




export async function getAllActiveHabitsWithCategory(userId: number): Promise<HabitCategoryOutput[] | null> {

    try {

        const habits = await prisma?.habit.findMany({
        where: {
            userId,
            isActive: true
        },
        include: {
            categoria: true, // include tutti i campi della categoria associata
        },
        })


        if(!habits) return null

        const validateHabits = HabitCategoryOutputSchema.array().safeParse(habits);
        

        if(!validateHabits.success) {
            console.error("Errore di validazione nel backend per habits category")
            return null
        }

        return validateHabits.data;

    } catch(err) {
        console.error("Errore backend nel recupero delle abitudini + categorie: ", err)
        throw new Error("Errore backend generico nel recupero delle abitudini + categorie")
    }

}
