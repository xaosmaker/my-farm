"use client";
import ControllledSelect from "@/components/ControllledSelect";
import ShowFieldPage from "@/components/ShowFieldPage";
import { getLandUnit, LandUnit, setLandUnit } from "@/lib/settings";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

type Units = {
  landUnit: string;
};
export default function SettingsPage() {
  const { control } = useForm<Units>({
    mode: "onChange",
    defaultValues: {
      landUnit: getLandUnit().name,
    },
  });
  const { landUnit } = useWatch({ control });
  useEffect(() => {
    setLandUnit((landUnit as LandUnit) || "default");
  }, [landUnit]);
  console.log(landUnit);
  return (
    <ShowFieldPage title="Ρυθμίσεις">
      <ControllledSelect
        control={control}
        name="landUnit"
        placeholder="Μονάδα μέτρησής εδάφους"
        values={[
          { value: "stremata", label: "Στρέμματα" },
          { value: "hectares", label: "Εκτάρια" },
          { value: "default", label: "Τετραγωνικά μέτρα" },
        ]}
      />
    </ShowFieldPage>
  );
}
