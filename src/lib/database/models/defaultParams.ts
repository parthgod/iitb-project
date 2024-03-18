import { convertField } from "@/utils/helperFunctions";
import { Schema, model, models } from "mongoose";

const defaultParamSchema = new Schema(
  {
    busColumns: {
      type: Array,
      default: [
        {
          field: convertField("Bus Name"),
          title: "Bus Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Nominal kV"),
          title: "Nominal kV",
          type: "text",
          isDefault: true,
        },
      ],
    },
    excitationSystemColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device name"),
          title: "Device name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Automatic Voltage Regulator(AVR) Type"),
          title: "Automatic Voltage Regulator(AVR) Type",
          type: "dropdown",
          dropdownValues: ["Static", "Brushless", "Other"],
          isDefault: true,
        },
        {
          field: convertField("Generator Device Name"),
          title: "Generator Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("AVR Image"),
          title: "AVR Image",
          type: "image",
          isDefault: true,
        },
        {
          field: convertField("Power System Stabilizer(PSS) Image"),
          title: "Power System Stabilizer(PSS) Image",
          type: "image",
          isDefault: true,
        },
        {
          field: convertField("Under Excitation Limiter(UEL) image"),
          title: "Under Excitation Limiter(UEL) image",
          type: "image",
          isDefault: true,
        },
        {
          field: convertField("Over Excitation Limiter(OEL) image"),
          title: "Over Excitation Limiter(OEL) image",
          type: "image",
          isDefault: true,
        },
      ],
    },
    generatorColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device name"),
          title: "Device name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus (To)"),
          title: "Bus (To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section (To)"),
          title: "Bus section (To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Type"),
          title: "Type",
          type: "dropdown",
          dropdownValues: ["Gas", "Hydro", "Steam"],
          isDefault: true,
        },
        {
          field: convertField("Rotor"),
          title: "Rotor",
          type: "dropdown",
          dropdownValues: ["Round rotor", "Salient Pole"],
          isDefault: true,
        },
        {
          field: convertField("MW"),
          title: "MW",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Kv"),
          title: "Kv",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Synchronous Reactance (pu)"),
          title: "Synchronous Reactance (pu)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Synchronous Reactance (pu)" + "Xd"),
              title: "Xd",
              type: "text",
            },
            {
              field: convertField("Synchronous Reactance (pu)" + "Xq"),
              title: "Xq",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Transient Reactance (pu)"),
          title: "Transient Reactance (pu)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Transient Reactance (pu)" + "Xd'"),
              title: "Xd'",
              type: "text",
            },
            {
              field: convertField("Transient Reactance (pu)" + "Xq'"),
              title: "Xq'",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Subtransient Reactance (pu)"),
          title: "Subtransient Reactance (pu)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Subtransient Reactance (pu)" + "Xd''"),
              title: "Xd''",
              type: "text",
            },
            {
              field: convertField("Subtransient Reactance (pu)" + "Xq''"),
              title: "Xq''",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Transient OC Time Constant (seconds)"),
          title: "Transient OC Time Constant (seconds)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Transient OC Time Constant (seconds)" + "Td0'"),
              title: "Td0'",
              type: "text",
            },
            {
              field: convertField("Transient OC Time Constant (seconds)" + "Tq0'"),
              title: "Tq0'",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Subtransient OC Time Constant (seconds)"),
          title: "Subtransient OC Time Constant (seconds)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Subtransient OC Time Constant (seconds)" + "Td0''"),
              title: "Td0''",
              type: "text",
            },
            {
              field: convertField("Subtransient OC Time Constant (seconds)" + "Tq0''"),
              title: "Tq0''",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Stator Leakage Inductance (pu)"),
          title: "Stator Leakage Inductance (pu)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Stator Leakage Inductance (pu)" + "Xl"),
              title: "Xl",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Stator resistance (pu)"),
          title: "Stator resistance (pu)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Stator resistance (pu)" + "Ra"),
              title: "Ra",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Inertia (MJ/MVA)"),
          title: "Inertia (MJ/MVA)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Inertia (MJ/MVA)" + "H"),
              title: "H",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Poles"),
          title: "Poles",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Speed"),
          title: "Speed",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Frequency"),
          title: "Frequency",
          type: "text",
          isDefault: true,
        },
      ],
    },
    loadsColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device Name"),
          title: "Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section (From)"),
          title: "Bus section (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("P (MW)"),
          title: "P (MW)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Q (Mvar)"),
          title: "Q (Mvar)",
          type: "text",
          isDefault: true,
        },
      ],
    },
    seriesCapacitorColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device Name"),
          title: "Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Mvar"),
          title: "Mvar",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("%Compensation"),
          title: "%Compensation",
          type: "text",
          isDefault: true,
        },
      ],
    },
    shuntCapacitorColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device Name"),
          title: "Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section (From)"),
          title: "Bus section (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("kV"),
          title: "kV",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
        },
      ],
    },
    shuntReactorsColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device Name"),
          title: "Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section (From)"),
          title: "Bus section (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("kV"),
          title: "kV",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
        },
      ],
    },
    singleLineDiagramsColumns: {
      type: Array,
      default: [
        {
          field: convertField("Description"),
          title: "Description",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Image"),
          title: "Image",
          type: "image",
          isDefault: true,
        },
      ],
    },
    transformersThreeWindingColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device Name"),
          title: "Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus_Primary (From)"),
          title: "Bus_Primary (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus_Primary section(From)"),
          title: "Bus_Primary section(From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus_Secondary (To)"),
          title: "Bus_Secondary (To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section_Secondary(To)"),
          title: "Bus section_Secondary(To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus_Tertiary (To)"),
          title: "Bus_Tertiary (To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section_Tertiary(To)"),
          title: "Bus section_Tertiary(To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("kV-Primary voltage"),
          title: "kV-Primary voltage",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("kV-Secondary voltage"),
          title: "kV-Secondary voltage",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("kV-Tertiary voltage"),
          title: "kV-Tertiary voltage",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("PS(Primary-Secondary)"),
          title: "PS(Primary-Secondary)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("PS(Primary-Secondary)" + "R"),
              title: "R",
              type: "text",
            },
            {
              field: convertField("PS(Primary-Secondary)" + "X"),
              title: "X",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("PT(Primary-Tertiary)"),
          title: "PT(Primary-Tertiary)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("PT(Primary-Tertiary)" + "R"),
              title: "R",
              type: "text",
            },
            {
              field: convertField("PT(Primary-Tertiary)" + "X"),
              title: "X",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("ST(Secondary-Tertiary)"),
          title: "ST(Secondary-Tertiary)",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("ST(Secondary-Tertiary)" + "R"),
              title: "R",
              type: "text",
            },
            {
              field: convertField("ST(Secondary-Tertiary)" + "X"),
              title: "X",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("% Tap (primary)"),
          title: "% Tap (primary)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("% Tap (secondary)"),
          title: "% Tap (secondary)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("% Tap (Tertiary)"),
          title: "% Tap (Tertiary)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Primary Connection"),
          title: "Primary Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
        },
        {
          field: convertField("Primary Connection Grounding"),
          title: "Primary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
        },
        {
          field: convertField("Secondary Connection"),
          title: "Secondary Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
        },
        {
          field: convertField("Secondary Connection Grounding"),
          title: "Secondary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
        },
        {
          field: convertField("Tertiary Connection"),
          title: "Tertiary Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
        },
        {
          field: convertField("Tertiary Connection Grounding"),
          title: "Tertiary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
        },
      ],
    },
    transformersTwoWindingColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device Name"),
          title: "Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section(From)"),
          title: "Bus section(From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus (To)"),
          title: "Bus (To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section(To)"),
          title: "Bus section(To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("kV-Primary"),
          title: "kV-Primary",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("kV-Secondary"),
          title: "kV-Secondary",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("R"),
          title: "R",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("X"),
          title: "X",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("% Tap (primary)"),
          title: "% Tap (primary)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("% Tap (secondary)"),
          title: "% Tap (secondary)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Primary Winding Connection"),
          title: "Primary Winding Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
        },
        {
          field: convertField("Primary Connection Grounding"),
          title: "Primary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
        },
        {
          field: convertField("Secondary Winding Connection"),
          title: "Secondary Winding Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
        },
        {
          field: convertField("Secondary Connection Grounding"),
          title: "Secondary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
        },
        {
          field: convertField("Angle"),
          title: "Angle",
          type: "dropdown",
          dropdownValues: ["0", "30", "60", "90", "120", "150", "180", "-150", "-120", "-90", "-60", "-30"],
          isDefault: true,
        },
      ],
    },
    transmissionLinesColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device Name"),
          title: "Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Type"),
          title: "Type",
          type: "dropdown",
          dropdownValues: ["Over head conductor", "Cable"],
          isDefault: true,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section(From)"),
          title: "Bus section(From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus  (To)"),
          title: "Bus  (To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Bus section(To)"),
          title: "Bus section(To)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Positive sequence"),
          title: "Positive sequence",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Positive sequence" + "R(ohms/perunitlength)"),
              title: "R(ohms/perunitlength)",
              type: "text",
            },
            {
              field: convertField("Positive sequence" + "X(ohms/perunitlength)"),
              title: "X(ohms/perunitlength)",
              type: "text",
            },
            {
              field: convertField("Positive sequence" + "B(seimens/perunitlength)"),
              title: "B(seimens/perunitlength)",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Negative sequence"),
          title: "Negative sequence",
          type: "subColumns",
          subColumns: [
            {
              field: convertField("Negative sequence" + "R(ohms/perunitlength)"),
              title: "R(ohms/perunitlength)",
              type: "text",
            },
            {
              field: convertField("Negative sequence" + "X(ohms/perunitlength)"),
              title: "X(ohms/perunitlength)",
              type: "text",
            },
            {
              field: convertField("Negative sequence" + "B(seimens/perunitlength)"),
              title: "B(seimens/perunitlength)",
              type: "text",
            },
          ],
          isDefault: true,
        },
        {
          field: convertField("Length (km)"),
          title: "Length (km)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Line Reactor (From)"),
          title: "Line Reactor (From)",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Line Reactor (To)"),
          title: "Line Reactor (To)",
          type: "text",
          isDefault: true,
        },
      ],
    },
    turbineGovernorColumns: {
      type: Array,
      default: [
        {
          field: convertField("Device name"),
          title: "Device name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Turbine Type"),
          title: "Turbine Type",
          type: "dropdown",
          dropdownValues: ["Steam", "Hydro-Pelton Turbine", "Hydro-Francis Turbine", "Hydro-Kaplan Turbine"],
          isDefault: true,
        },
        {
          field: convertField("Generator Device Name"),
          title: "Generator Device Name",
          type: "text",
          isDefault: true,
        },
        {
          field: convertField("Turbine model image"),
          title: "Turbine model image",
          type: "image",
          isDefault: true,
        },
      ],
    },
    ibrColumns: {
      type: Array,
      default: [],
    },
    lccHVDCLinkColumns: {
      type: Array,
      default: [],
    },
    seriesFactsColumns: {
      type: Array,
      default: [],
    },
    shuntFactsColumns: {
      type: Array,
      default: [],
    },
    vscHVDCLinkColumns: {
      type: Array,
      default: [],
    },
  },
  {
    collectionOptions: { changeStreamPreAndPostImages: { enabled: true } },
  }
);

const DefaultParam = models.DefaultParam || model("DefaultParam", defaultParamSchema);

export default DefaultParam;
