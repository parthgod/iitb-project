export type IColumn = {
  field: string;
  title: string;
  type: string;
  isDefault: boolean;
  isHidden: boolean;
  dropdownValues?: any;
  tableRef?: string;
  columnRef?: string;
  [key: string]: any;
};

export type INonDefaultDatabases = {
  _id: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ILoginRequest = {
  _id: string;
  name: string;
  email: string;
  image: string;
  status: string;
  time: string;
};

export type ISIdeMenu = {
  name: string;
  route: string;
  icon: any;
};

export type IColumnDetails = {
  name: string;
  dropdownValues?: { name: string }[];
  type: string;
  dropdownFromExistingTable?: "true" | "false";
  dropdownTableRef?: string;
  dropdownColumnRef?: string;
};

export type IUser = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  image?: string;
  latestLoginTime: string;
  disabled: boolean;
  createdAt: string;
  resetPasswordToken: string;
  resetPasswordExpiry: string;
};

export type IModificationHistory = {
  _id: string;
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
    | "Turbine Governor"
    | "IBR"
    | "LCC-HVDC Link"
    | "VSC-HVDC Link"
    | "Series Fact"
    | "Shunt Fact";
  operationType: "Create" | "Update" | "Delete";
  date: string;
  message: string;
  document: {
    id?: string;
    documentBeforeChange?: any;
    documentAfterChange?: any;
    columnDetails?: any;
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
  lccHVDCLinkColumns: IColumn[];
  seriesFactsColumns: IColumn[];
  shuntFactsColumns: IColumn[];
  vscHVDCLinkColumns: IColumn[];
  [key: string]: any;
};

export type IBus = {
  _id: string;
  busName?: string;
  nominalKV?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type IRequest = {
  _id: string;
  user: IUser;
  message: string;
  status: "Pending" | "Completed" | "Rejected";
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
  circuitBreakerStatus: string;
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
  _id: string;
  deviceName?: string;
  circuitBreakerStatus: string;
  busFrom?: string;
  busSectionFrom?: string;
  pMW?: string;
  qMvar?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ISeriesCapacitor = {
  _id: string;
  deviceName?: string;
  mvar?: string;
  compensation?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type IShuntCapacitor = {
  _id: string;
  deviceName?: string;
  circuitBreakerStatus: string;
  busFrom?: string;
  busSectionFrom?: string;
  kv?: string;
  mva?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type IShuntReactor = {
  _id: string;
  deviceName?: string;
  circuitBreakerStatus: string;
  busFrom?: string;
  busSectionFrom?: string;
  kv?: string;
  mva?: string;
  additionalFields?: Record<string, any>;
  [key: string]: any;
};

export type ISingleLineDiagram = {
  _id: string;
  description?: string;
  image?: string;
  [key: string]: any;
};

export type ITransformersThreeWinding = {
  _id: string;
  deviceName?: string;
  circuitBreakerStatus: string;
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
  _id: string;
  deviceName?: string;
  circuitBreakerStatus: string;
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
  _id: string;
  deviceName?: string;
  type?: string;
  circuitBreakerStatus: string;
  busFrom?: string;
  busSectionFrom?: string;
  kv: string;
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
  _id: string;
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
