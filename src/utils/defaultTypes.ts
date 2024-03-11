export type IColumn = {
  field: string;
  title: string;
  type: string;
  isDefault: boolean;
  dropdownValues?: any;
  subColumns?: ISubColumn[];
  [key: string]: any;
};

export type ISIdeMenu = {
  name: string;
  route: string;
  icon: any;
};

export type IColumnDetails = {
  name: string;
  hasSubcolumns: "true" | "false";
  dropdownValues?: { name: string }[];
  type?: string;
  subcolumns?: any;
};

export type ISubColumn = {
  field: string;
  title: string;
  type: string;
  dropdownValues?: any;
  [key: string]: any;
};

export type IUser = {
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  image?: string;
};

export type IModificationHistory = {
  userId: IUser;
  databaseName:
    | "Bus"
    | "Excitation System"
    | "Generator"
    | "Load"
    | "Series Capacitor"
    | "Shunt Capacitor"
    | "Shunt Reactor"
    | "Single Line Diagram"
    | "Transformers Three Winding"
    | "Transformers Two Winding"
    | "Transmission Line"
    | "Turbine Governor";
  operationType: "Create" | "Update" | "Delete";
  date: string;
  document: {
    id?: string;
    documentBeforeChange: any;
    documentAfterChange: any;
    columnDetails: any;
  };
};

export type IDefaultParamSchema = {
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
  ibrColumns: IColumn[];
  lccHvdcLinkColumns: IColumn[];
  seriesFactsColumns: IColumn[];
  shuntFactsColumns: IColumn[];
  vscHvdcLinkColumns: IColumn[];
  [key: string]: any;
};

export type IBus = {
  busName?: string;
  nominalKV?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type IChange = {
  user: IUser;
  message: string;
  [key: string]: any;
};

export type IExcitationSystem = {
  _id: string;
  deviceName?: string;
  automaticVoltageRegulatorAVRType?: string;
  generatorDeviceName?: string;
  avrImage?: string;
  powerSystemStabilizerPSSImage?: string;
  underExcitationLimiterUELImage?: string;
  overExcitationLimiterOELImage?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type IGenerator = {
  _id: string;
  deviceName?: string;
  busTo?: string;
  busSectionTo?: string;
  type?: string;
  rotor?: string;
  mw?: string;
  mva?: string;
  kv?: string;
  synchronousReactancePu?: any;
  transientReactancePu?: any;
  subtransientReactancePu?: any;
  transientOCTimeConstantSeconds?: any;
  subtransientOCTimeConstantSeconds?: any;
  statorLeakageInductancePu?: any;
  statorResistancePu?: any;
  inertiaMJMVA?: any;
  poles?: string;
  speed?: string;
  frequency?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ILoad = {
  deviceName?: string;
  busFrom?: string;
  busSectionFrom?: string;
  pMW?: string;
  qMvar?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ISeriesCapacitor = {
  deviceName?: string;
  mvar?: string;
  compensation?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type IShuntCapacitor = {
  deviceName?: string;
  busFrom?: string;
  busSectionFrom?: string;
  kv?: string;
  mva?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type IShuntReactor = {
  deviceName?: string;
  busFrom?: string;
  busSectionFrom?: string;
  kv?: string;
  mva?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ISingleLineDiagram = {
  description?: string;
  image?: string;
  [key: string]: any;
};

export type ITransformersThreeWinding = {
  deviceName?: string;
  busprimaryFrom?: string;
  busprimarySectionFrom?: string;
  bussecondaryTo?: string;
  busSectionSecondaryTo?: string;
  bustertiaryTo?: string;
  busSectionTertiaryTo?: string;
  mva?: string;
  kvprimaryVoltage?: string;
  kvsecondaryVoltage?: string;
  kvtertiaryVoltage?: string;
  psprimarysecondary?: any;
  ptprimarytertiary?: any;
  stsecondarytertiary?: any;
  TapPrimary?: string;
  TapSecondary?: string;
  TapTertiary?: string;
  primaryConnection?: string;
  primaryConnectionGrounding?: string;
  secondaryConnection?: string;
  secondaryConnectionGrounding?: string;
  tertiaryConnection?: string;
  tertiaryConnectionGrounding?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ITransformersTwoWinding = {
  deviceName?: string;
  busFrom?: string;
  busSectionFrom?: string;
  busTo?: string;
  busSectionTo?: string;
  mva?: string;
  kvprimary?: string;
  kvsecondary?: string;
  r?: string;
  x?: string;
  TapPrimary?: string;
  TapSecondary?: string;
  primaryWindingConnection?: string;
  primaryConnectionGrounding?: string;
  secondaryWindingConnection?: string;
  secondaryConnectionGrounding?: string;
  angle?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ITransmissionLine = {
  deviceName?: string;
  type?: string;
  busFrom?: string;
  busSectionFrom?: string;
  busTo?: string;
  busSectionTo?: string;
  positiveSequence?: any;
  negativeSequence?: any;
  lengthKm?: string;
  lineReactorFrom?: string;
  lineReactorTo?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ITurbineGovernor = {
  deviceName?: string;
  turbineType?: string;
  generatorDeviceName?: string;
  turbineModelImage?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ICreateUpdateParams = {
  defaultFields: any;
  additionalFields: Record<string, any>;
  [key: string]: any;
};
