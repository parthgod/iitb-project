import { Schema, model, models } from "mongoose";

export interface IColumn {
  field: string;
  title: string;
  type: string;
  isDefault: boolean;
  dropdownValues?: any;
  subColumns?: any;
}

export interface IDefaultParamSchema {
  busColumns: IColumn[];
  excitationSystemColumns: IColumn[];
  generatorColumns: IColumn[];
  loadsColumns: IColumn[];
  seriesCapacitorColumns: IColumn[];
  shuntCapacitorColumns: IColumn[];
  shuntReactorsColumns: IColumn[];
  singleLineDiagramsColumns: IColumn[];
  transformersThreeWindingColumns: IColumn[];
  transformersTwoWindingColumns: IColumn[];
  transmissionLinesColumns: IColumn[];
  turbineGovernorColumns: IColumn[];
}

const defaultParamSchema = new Schema({
  busColumns: {
    type: Array,
    default: [
      {
        field: "busName",
        title: "Bus Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "nominalKV",
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
        field: "deviceName",
        title: "Device name",
        type: "text",
        isDefault: true,
      },
      {
        field: "AVRType",
        title: "Automatic Voltage Regulator(AVR) Type",
        type: "dropdown",
        dropdownValues: ["Static", "Brushless", "Other"],
        isDefault: true,
      },
      {
        field: "generatorDeviceName",
        title: "Generator Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "AVRImage",
        title: "AVR Image",
        type: "image",
        isDefault: true,
      },
      {
        field: "PSSImage",
        title: "Power System Stabilizer(PSS) Image",
        type: "image",
        isDefault: true,
      },
      {
        field: "UELImage",
        title: "Under Excitation Limiter(UEL) image",
        type: "image",
        isDefault: true,
      },
      {
        field: "OELImage",
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
        field: "deviceName",
        title: "Device name",
        type: "text",
        isDefault: true,
      },
      {
        field: "busTo",
        title: "Bus (To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSectionTo",
        title: "Bus section (To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "type",
        title: "Type",
        type: "dropdown",
        dropdownValues: ["Gas", "Hydro", "Steam"],
        isDefault: true,
      },
      {
        field: "rotor",
        title: "Rotor",
        type: "dropdown",
        dropdownValues: ["Round rotor", "Salient Pole"],
        isDefault: true,
      },
      {
        field: "MW",
        title: "MW",
        type: "text",
        isDefault: true,
      },
      {
        field: "MVA",
        title: "MVA",
        type: "text",
        isDefault: true,
      },
      {
        field: "Kv",
        title: "Kv",
        type: "text",
        isDefault: true,
      },
      {
        field: "synchronousReactance",
        title: "Synchronous Reactance (pu)",
        type: "subColumns",
        subColumns: [
          {
            field: "synchronousReactanceXd",
            title: "Xd",
            type: "text",
          },
          {
            field: "synchronousReactanceXq",
            title: "Xq",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "transientReactance",
        title: "Transient Reactance (pu)",
        type: "subColumns",
        subColumns: [
          {
            field: "transientReactanceXdPrime",
            title: "Xd'",
            type: "text",
          },
          {
            field: "transientReactanceXqPrime",
            title: "Xq'",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "subtransientReactance",
        title: "Subtransient Reactance (pu)",
        type: "subColumns",
        subColumns: [
          {
            field: "subtransientReactanceXdPrimePrime",
            title: "Xd''",
            type: "text",
          },
          {
            field: "subtransientReactanceXqPrimePrime",
            title: "Xq''",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "transientOCTimeConstant",
        title: "Transient OC Time Constant (seconds)",
        type: "subColumns",
        subColumns: [
          {
            field: "transientOCTimeConstantTd0Prime",
            title: "Td0'",
            type: "text",
          },
          {
            field: "transientOCTimeConstantTq0Prime",
            title: "Tq0'",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "subTransientOCTimeConstant",
        title: "Subtransient OC Time Constant (seconds)",
        type: "subColumns",
        subColumns: [
          {
            field: "subTransientOCTimeConstantTd0PrimePrime",
            title: "Td0''",
            type: "text",
          },
          {
            field: "subTransientOCTimeConstantTq0PrimePrime",
            title: "Tq0''",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "StatorLeakageInductance",
        title: "Stator Leakage Inductance (pu)",
        type: "subColumns",
        subColumns: [
          {
            field: "StatorLeakageInductanceXl",
            title: "Xl",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "statorResistance",
        title: "Stator resistance (pu)",
        type: "subColumns",
        subColumns: [
          {
            field: "statorResistanceRa",
            title: "Ra",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "inertia",
        title: "Inertia (MJ/MVA)",
        type: "subColumns",
        subColumns: [
          {
            field: "inertiaH",
            title: "H",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "poles",
        title: "Poles",
        type: "text",
        isDefault: true,
      },
      {
        field: "speed",
        title: "Speed",
        type: "text",
        isDefault: true,
      },
      {
        field: "frequency",
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
        field: "deviceName",
        title: "Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "busFrom",
        title: "Bus (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSectionFrom",
        title: "Bus section (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "PMW",
        title: "P (MW)",
        type: "text",
        isDefault: true,
      },
      {
        field: "QMvar",
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
        field: "deviceName",
        title: "Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "Mvar",
        title: "Mvar",
        type: "text",
        isDefault: true,
      },
      {
        field: "compensation",
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
        field: "deviceName",
        title: "Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "busFrom",
        title: "Bus (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSectionFrom",
        title: "Bus section (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "kV",
        title: "kV",
        type: "text",
        isDefault: true,
      },
      {
        field: "MVA",
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
        field: "deviceName",
        title: "Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "busFrom",
        title: "Bus (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSectionFrom",
        title: "Bus section (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "kV",
        title: "kV",
        type: "text",
        isDefault: true,
      },
      {
        field: "MVA",
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
        field: "description",
        title: "Description",
        type: "text",
        isDefault: true,
      },
      {
        field: "image",
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
        field: "deviceName",
        title: "Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "busPrimaryFrom",
        title: "Bus_Primary (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busPrimarySectionFrom",
        title: "Bus_Primary section(From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSecondaryTo",
        title: "Bus_Secondary (To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSecondarySetionTo",
        title: "Bus section_Secondary(To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busTertiaryTo",
        title: "Bus_Tertiary (To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busTertiarySectionTo",
        title: "Bus section_Tertiary(To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "MVA",
        title: "MVA",
        type: "text",
        isDefault: true,
      },
      {
        field: "kVPrimaryVoltage",
        title: "kV-Primary voltage",
        type: "text",
        isDefault: true,
      },
      {
        field: "kVSecondaryVoltage",
        title: "kV-Secondary voltage",
        type: "text",
        isDefault: true,
      },
      {
        field: "kVTertiaryVoltage",
        title: "kV-Tertiary voltage",
        type: "text",
        isDefault: true,
      },
      {
        field: "PrimarySecondary",
        title: "PS(Primary-Secondary)",
        type: "subColumns",
        subColumns: [
          {
            field: "PrimarySecondaryR",
            title: "R",
            type: "text",
          },
          {
            field: "PrimarySecondaryX",
            title: "X",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "PrimaryTertiary",
        title: "PT(Primary-Tertiary)",
        type: "subColumns",
        subColumns: [
          {
            field: "PrimaryTertiaryR",
            title: "R",
            type: "text",
          },
          {
            field: "PrimaryTertiaryX",
            title: "X",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "SecondaryTertiary",
        title: "ST(Secondary-Tertiary)",
        type: "subColumns",
        subColumns: [
          {
            field: "SecondaryTertiaryR",
            title: "R",
            type: "text",
          },
          {
            field: "SecondaryTertiaryX",
            title: "X",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "tapPrimary",
        title: "% Tap (primary)",
        type: "text",
        isDefault: true,
      },
      {
        field: "tapSecondary",
        title: "% Tap (secondary)",
        type: "text",
        isDefault: true,
      },
      {
        field: "tapTertiary",
        title: "% Tap (Tertiary)",
        type: "text",
        isDefault: true,
      },
      {
        field: "primaryConnection",
        title: "Primary Connection",
        type: "dropdown",
        dropdownValues: ["Delta", "Star"],
        isDefault: true,
      },
      {
        field: "primaryConnectionGrounding",
        title: "Primary Connection Grounding",
        type: "dropdown",
        dropdownValues: ["Grounded", "Ungrounded", "None"],
        isDefault: true,
      },
      {
        field: "secondaryConnection",
        title: "Secondary Connection",
        type: "dropdown",
        dropdownValues: ["Delta", "Star"],
        isDefault: true,
      },
      {
        field: "secondaryConnectionGrounding",
        title: "Secondary Connection Grounding",
        type: "dropdown",
        dropdownValues: ["Grounded", "Ungrounded", "None"],
        isDefault: true,
      },
      {
        field: "tertiaryConnection",
        title: "Tertiary Connection",
        type: "dropdown",
        dropdownValues: ["Delta", "Star"],
        isDefault: true,
      },
      {
        field: "tertiaryConnectionGrounding",
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
        field: "deviceName",
        title: "Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "busFrom",
        title: "Bus (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSectionFrom",
        title: "Bus section(From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busTo",
        title: "Bus  (To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSetionTo",
        title: "Bus section(To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "MVA",
        title: "MVA",
        type: "text",
        isDefault: true,
      },
      {
        field: "kVPrimary",
        title: "kV-Primary",
        type: "text",
        isDefault: true,
      },
      {
        field: "kVSecondary",
        title: "kV-Secondary",
        type: "text",
        isDefault: true,
      },
      {
        field: "R",
        title: "R",
        type: "text",
        isDefault: true,
      },
      {
        field: "X",
        title: "X",
        type: "text",
        isDefault: true,
      },
      {
        field: "tapPrimary",
        title: "% Tap (primary)",
        type: "text",
        isDefault: true,
      },
      {
        field: "tapSecondary",
        title: "% Tap (secondary)",
        type: "text",
        isDefault: true,
      },
      {
        field: "primaryWindingConnection",
        title: "Primary Winding Connection",
        type: "dropdown",
        dropdownValues: ["Delta", "Star"],
        isDefault: true,
      },
      {
        field: "primaryConnectionGrounding",
        title: "Primary Connection Grounding",
        type: "dropdown",
        dropdownValues: ["Grounded", "Ungrounded", "None"],
        isDefault: true,
      },
      {
        field: "secondaryWindingConnection",
        title: "Secondary Winding Connection",
        type: "dropdown",
        dropdownValues: ["Delta", "Star"],
        isDefault: true,
      },
      {
        field: "secondaryConnectionGrounding",
        title: "Secondary Connection Grounding",
        type: "dropdown",
        dropdownValues: ["Grounded", "Ungrounded", "None"],
        isDefault: true,
      },
      {
        field: "angle",
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
        field: "deviceName",
        title: "Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "type",
        title: "Type",
        type: "dropdown",
        dropdownValues: ["Over head conductor", "Cable"],
        isDefault: true,
      },
      {
        field: "busFrom",
        title: "Bus (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSectionFrom",
        title: "Bus section(From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busTo",
        title: "Bus  (To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "busSetionTo",
        title: "Bus section(To)",
        type: "text",
        isDefault: true,
      },
      {
        field: "positiveSequence",
        title: "Positive sequence",
        type: "subColumns",
        subColumns: [
          {
            field: "positiveSequenceR",
            title: "R(ohms/perunitlength)",
            type: "text",
          },
          {
            field: "positiveSequenceX",
            title: "X(ohms/perunitlength)",
            type: "text",
          },
          {
            field: "positiveSequenceB",
            title: "B(seimens/perunitlength)",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "negativeSequence",
        title: "Negative sequence",
        type: "subColumns",
        subColumns: [
          {
            field: "negativeSequenceR",
            title: "R(ohms/perunitlength)",
            type: "text",
          },
          {
            field: "negativeSequenceX",
            title: "X(ohms/perunitlength)",
            type: "text",
          },
          {
            field: "negativeSequenceB",
            title: "B(seimens/perunitlength)",
            type: "text",
          },
        ],
        isDefault: true,
      },
      {
        field: "length",
        title: "Length (km)",
        type: "text",
        isDefault: true,
      },
      {
        field: "lineReactorFrom",
        title: "Line Reactor (From)",
        type: "text",
        isDefault: true,
      },
      {
        field: "lineReactorTo",
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
        field: "deviceName",
        title: "Device name",
        type: "text",
        isDefault: true,
      },
      {
        field: "turbineType",
        title: "Turbine Type",
        type: "dropdown",
        dropdownValues: ["Steam", "Hydro-Pelton Turbine", "Hydro-Francis Turbine", "Hydro-Kaplan Turbine"],
        isDefault: true,
      },
      {
        field: "generatorDeviceName",
        title: "Generator Device Name",
        type: "text",
        isDefault: true,
      },
      {
        field: "turbineModelImage",
        title: "Turbine model image",
        type: "image",
        isDefault: true,
      },
    ],
  },
});

const DefaultParam = models.DefaultParam || model("DefaultParam", defaultParamSchema);

export default DefaultParam;
