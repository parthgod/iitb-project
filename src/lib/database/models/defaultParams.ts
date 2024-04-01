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
          isHidden: false,
        },
        {
          field: convertField("Nominal kV"),
          title: "Nominal kV",
          type: "text",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Automatic Voltage Regulator(AVR) Type"),
          title: "Automatic Voltage Regulator(AVR) Type",
          type: "dropdown",
          dropdownValues: ["Static", "Brushless", "Other"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Generator Device Name"),
          title: "Generator Device Name",
          type: "dropdown",
          tableRef: "Generator",
          columnRef: "deviceName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("AVR Image"),
          title: "AVR Image",
          type: "image",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Power System Stabilizer(PSS) Image"),
          title: "Power System Stabilizer(PSS) Image",
          type: "image",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Under Excitation Limiter(UEL) image"),
          title: "Under Excitation Limiter(UEL) image",
          type: "image",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Over Excitation Limiter(OEL) image"),
          title: "Over Excitation Limiter(OEL) image",
          type: "image",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Circuit Breaker Status"),
          title: "Circuit Breaker Status",
          type: "switch",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus (To)"),
          title: "Bus (To)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section (To)"),
          title: "Bus section (To)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Type"),
          title: "Type",
          type: "dropdown",
          dropdownValues: ["Gas", "Hydro", "Steam"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Rotor"),
          title: "Rotor",
          type: "dropdown",
          dropdownValues: ["Round rotor", "Salient Pole"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("MW"),
          title: "MW",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Kv"),
          title: "Kv",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Synchronous Reactance (pu): Xd"),
          title: "Synchronous Reactance (pu): Xd",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Synchronous Reactance (pu): Xq"),
          title: "Synchronous Reactance (pu): Xq",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Transient Reactance (pu): Xd'"),
          title: "Transient Reactance (pu): Xd'",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Transient Reactance (pu): Xq'"),
          title: "Transient Reactance (pu): Xq'",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Subtransient Reactance (pu): Xd''"),
          title: "Subtransient Reactance (pu): Xd''",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Subtransient Reactance (pu): Xq''"),
          title: "Subtransient Reactance (pu): Xq''",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Transient OC Time Constant (seconds): Td0'"),
          title: "Transient OC Time Constant (seconds): Td0'",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Transient OC Time Constant (seconds): Tq0'"),
          title: "Transient OC Time Constant (seconds): Tq0'",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Subtransient OC Time Constant (seconds): Td0''"),
          title: "Subtransient OC Time Constant (seconds): Td0''",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Subtransient OC Time Constant (seconds): Tq0''"),
          title: "Subtransient OC Time Constant (seconds): Tq0''",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Stator Leakage Inductance (pu): Xl"),
          title: "Stator Leakage Inductance (pu): Xl",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Stator resistance (pu): Ra"),
          title: "Stator resistance (pu): Ra",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Inertia (MJ/MVA): H"),
          title: "Inertia (MJ/MVA): H",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Poles"),
          title: "Poles",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Speed"),
          title: "Speed",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Frequency"),
          title: "Frequency",
          type: "text",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Circuit Breaker Status"),
          title: "Circuit Breaker Status",
          type: "switch",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section (From)"),
          title: "Bus section (From)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("P (MW)"),
          title: "P (MW)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Q (Mvar)"),
          title: "Q (Mvar)",
          type: "text",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Mvar"),
          title: "Mvar",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("%Compensation"),
          title: "%Compensation",
          type: "text",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Circuit Breaker Status"),
          title: "Circuit Breaker Status",
          type: "switch",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section (From)"),
          title: "Bus section (From)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("kV"),
          title: "kV",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Circuit Breaker Status"),
          title: "Circuit Breaker Status",
          type: "switch",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section (From)"),
          title: "Bus section (From)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("kV"),
          title: "kV",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Image"),
          title: "Image",
          type: "image",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Circuit Breaker Status"),
          title: "Circuit Breaker Status",
          type: "switch",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus_Primary (From)"),
          title: "Bus_Primary (From)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus_Primary section(From)"),
          title: "Bus_Primary section(From)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus_Secondary (To)"),
          title: "Bus_Secondary (To)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section_Secondary(To)"),
          title: "Bus section_Secondary(To)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus_Tertiary (To)"),
          title: "Bus_Tertiary (To)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section_Tertiary(To)"),
          title: "Bus section_Tertiary(To)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("kV-Primary voltage"),
          title: "kV-Primary voltage",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("kV-Secondary voltage"),
          title: "kV-Secondary voltage",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("kV-Tertiary voltage"),
          title: "kV-Tertiary voltage",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("PS(Primary-Secondary): R"),
          title: "PS(Primary-Secondary): R",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("PS(Primary-Secondary): X"),
          title: "PS(Primary-Secondary): X",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("PT(Primary-Tertiary): R"),
          title: "PT(Primary-Tertiary): R",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("PT(Primary-Tertiary): X"),
          title: "PT(Primary-Tertiary): X",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("ST(Secondary-Tertiary): R"),
          title: "ST(Secondary-Tertiary): R",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("ST(Secondary-Tertiary): X"),
          title: "ST(Secondary-Tertiary): X",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("% Tap (primary)"),
          title: "% Tap (primary)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("% Tap (secondary)"),
          title: "% Tap (secondary)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("% Tap (Tertiary)"),
          title: "% Tap (Tertiary)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Primary Connection"),
          title: "Primary Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Primary Connection Grounding"),
          title: "Primary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Secondary Connection"),
          title: "Secondary Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Secondary Connection Grounding"),
          title: "Secondary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Tertiary Connection"),
          title: "Tertiary Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Tertiary Connection Grounding"),
          title: "Tertiary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Circuit Breaker Status"),
          title: "Circuit Breaker Status",
          type: "switch",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section(From)"),
          title: "Bus section(From)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus (To)"),
          title: "Bus (To)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section(To)"),
          title: "Bus section(To)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("MVA"),
          title: "MVA",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("kV-Primary"),
          title: "kV-Primary",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("kV-Secondary"),
          title: "kV-Secondary",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("R"),
          title: "R",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("X"),
          title: "X",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("% Tap (primary)"),
          title: "% Tap (primary)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("% Tap (secondary)"),
          title: "% Tap (secondary)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Primary Winding Connection"),
          title: "Primary Winding Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Primary Connection Grounding"),
          title: "Primary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Secondary Winding Connection"),
          title: "Secondary Winding Connection",
          type: "dropdown",
          dropdownValues: ["Delta", "Star"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Secondary Connection Grounding"),
          title: "Secondary Connection Grounding",
          type: "dropdown",
          dropdownValues: ["Grounded", "Ungrounded", "None"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Angle"),
          title: "Angle",
          type: "dropdown",
          dropdownValues: ["0", "30", "60", "90", "120", "150", "180", "-150", "-120", "-90", "-60", "-30"],
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Type"),
          title: "Type",
          type: "dropdown",
          dropdownValues: ["Over head conductor", "Cable"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Circuit Breaker Status"),
          title: "Circuit Breaker Status",
          type: "switch",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus (From)"),
          title: "Bus (From)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section(From)"),
          title: "Bus section(From)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus  (To)"),
          title: "Bus  (To)",
          type: "dropdown",
          tableRef: "Bus",
          columnRef: "busName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Bus section(To)"),
          title: "Bus section(To)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Positive sequence: R(ohms/perunitlength)"),
          title: "Positive sequence: R(ohms/perunitlength)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Positive sequence: X(ohms/perunitlength)"),
          title: "Positive sequence: X(ohms/perunitlength)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Positive sequence: B(seimens/perunitlength)"),
          title: "Positive sequence: B(seimens/perunitlength)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Negative sequence: R(ohms/perunitlength)"),
          title: "Negative sequence: R(ohms/perunitlength)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Negative sequence: X(ohms/perunitlength)"),
          title: "Negative sequence: X(ohms/perunitlength)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Negative sequence: B(seimens/perunitlength)"),
          title: "Negative sequence: B(seimens/perunitlength)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Length (km)"),
          title: "Length (km)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Line Reactor (From)"),
          title: "Line Reactor (From)",
          type: "text",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Line Reactor (To)"),
          title: "Line Reactor (To)",
          type: "text",
          isDefault: true,
          isHidden: false,
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
          isHidden: false,
        },
        {
          field: convertField("Turbine Type"),
          title: "Turbine Type",
          type: "dropdown",
          dropdownValues: ["Steam", "Hydro-Pelton Turbine", "Hydro-Francis Turbine", "Hydro-Kaplan Turbine"],
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Generator Device Name"),
          title: "Generator Device Name",
          type: "dropdown",
          tableRef: "Generator",
          columnRef: "deviceName",
          isDefault: true,
          isHidden: false,
        },
        {
          field: convertField("Turbine model image"),
          title: "Turbine model image",
          type: "image",
          isDefault: true,
          isHidden: false,
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
