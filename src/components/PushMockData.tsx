"use client";

import { createBus } from "@/lib/actions/bus.actions";
import { createGenerator } from "@/lib/actions/generator.actions";
import { createLoad } from "@/lib/actions/load.actions";
import { createSeriesCapacitor } from "@/lib/actions/seriesCapacitor.actions";
import { createShuntCapacitor } from "@/lib/actions/shuntCapacitor.actions";
import { createShuntReactor } from "@/lib/actions/shuntReactor.actions";
import { createTransformersThreeWinding } from "@/lib/actions/transformersThreeWinding.actions";
import { createTransformersTwoWinding } from "@/lib/actions/transformersTwoWinding.actions";
import { createTransmissionLine } from "@/lib/actions/transmissionLines.actions";
import { IColumn } from "@/utils/defaultTypes";
import React, { useState } from "react";

const PushMockData = ({ mockData, session, columns }: { mockData: any; session: any; columns: IColumn[] }) => {
  const [done, setDone] = useState(false);

  const pushMockData = () => {
    mockData.forEach(async (data: any) => {
      const defaultFields: any = {};
      const additionalFields: any = {};
      columns.map((item) => {
        if (item.isDefault) {
          if (item.type === "subColumns") {
            const temp: any = {};
            item.subColumns!.map((subItem) => {
              temp[subItem.field] = data[subItem.field];
            });
            defaultFields[item.field] = temp;
          } else defaultFields[item.field] = data[item.field];
        } else {
          if (item.type === "subColumns") {
            const temp: any = {};
            item.subColumns!.map((subItem: any) => {
              temp[subItem.field] = data[subItem.field];
            });
            additionalFields[item.field] = temp;
          } else additionalFields[item.field] = data[item.field];
        }
      });
      let req = {
        defaultFields: defaultFields,
        additionalFields: additionalFields,
      };
      const response = await createTransmissionLine(req, session?.user.id!);
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
