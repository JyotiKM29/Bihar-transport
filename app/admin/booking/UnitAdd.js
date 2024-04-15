import React, { useContext, useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { UserContext } from "../../context/UserContextProvider";
import { useToast } from "../../components/ui/use-toast";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "../../components/ui/dialog";

const UnitAdd = ({ onUnitAdded }) => {
    const [unitName, setUnitName] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useContext(UserContext);

    const userId = user?._id;

    const displayToast = (title, action, description = "") => {
        toast({
            title,
            action,
            description,
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch("/api/addunit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    adminId: userId,
                    unitName
                }),
            });

            const result = await response.json();

            if (response.ok) {
                displayToast("Unit Added Successfully", "✅");
                setUnitName("");
                onUnitAdded(); // Call the onUnitAdded callback to trigger data fetching
            } else {
                console.error("Error:", result.message);
                displayToast("Failed to add unit", "❌", result.message);
            }
        } catch (error) {
            console.error("Error:", error.message);
            displayToast("Server Error", "❌", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"> + </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="h-full w-full rounded-3xl bg-white px-6 py-4 ">
                    <h2 className="font-semiBold  text-3xl ">
                        Add a New Unit:
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className=" flex w-full flex-col items-start justify-between self-end rounded-xl "
                    >
                        <label className="w-full items-center gap-4 md:flex">
                            <Input
                                label="Unit Name"
                                placeholder="Enter unit name"
                                id="unitName"
                                type="text"
                                required
                                value={unitName}
                                onChange={(e) => setUnitName(e.target.value)}
                                className="w-full"
                            />
                        </label>
                        <Button type="submit">{loading ? "Adding..." : "Add Unit"}</Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UnitAdd;
