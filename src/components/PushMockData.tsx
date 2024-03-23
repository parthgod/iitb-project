"use client";

import { createBus } from "@/lib/actions/bus.actions";
import { createGenerator } from "@/lib/actions/generator.actions";
import { createTransmissionLine } from "@/lib/actions/transmissionLines.actions";
import { IColumn } from "@/utils/defaultTypes";
import { useState } from "react";

const PushMockData = ({ mockData, session, columns }: { mockData: any; session: any; columns: IColumn[] }) => {
  const [done, setDone] = useState(false);

  const pushMockData = () => {
    mockData.forEach(async (data: any) => {
      const defaultFields: any = {};
      const additionalFields: any = {};
      columns.map((item) => {
        if (item.isDefault) {
          defaultFields[item.field] = data[item.field];
        } else {
          additionalFields[item.field] = data[item.field];
        }
      });
      let req = {
        defaultFields: defaultFields,
        additionalFields: additionalFields,
      };
      const response = await createGenerator(req, session?.user.id!);
    });
    setDone(true);
  };

  return (
    <div>
      <button onClick={pushMockData}>PushMockData</button>
      <p>{done ? "done" : "not done"}</p>
    </div>
  );
};

export default PushMockData;
