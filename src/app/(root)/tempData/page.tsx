import { authOptions } from "@/lib/authOptions";
import PushMockData from "@/components/PushMockData";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getServerSession } from "next-auth";
import Bus from "@/lib/database/models/bus";
import Generator from "@/lib/database/models/generator";

const mockData = [
  { busName: "FLR", location: "Longzhong", nominalKV: 89 },
  { busName: "OLA", location: "Arnhem", nominalKV: 21 },
  { busName: "SOG", location: "Pelotas", nominalKV: 21 },
  { busName: "SXL", location: "Houston", nominalKV: 91 },
  { busName: "HEH", location: "Arrah", nominalKV: 58 },
  { busName: "AZT", location: "Urachiche", nominalKV: 20 },
  { busName: "NON", location: "Drumcondra", nominalKV: 30 },
  { busName: "ARM", location: "Radomin", nominalKV: 81 },
  { busName: "DXD", location: "Yaring", nominalKV: 43 },
  { busName: "BXW", location: "Randudongkal", nominalKV: 36 },
  { busName: "MCT", location: "Ezeiza", nominalKV: 73 },
  { busName: "PAZ", location: "Dankama", nominalKV: 63 },
  { busName: "SKB", location: "Nevel’", nominalKV: 50 },
  { busName: "PMV", location: "Little Baguio", nominalKV: 73 },
  { busName: "SDP", location: "Pacobamba", nominalKV: 22 },
  { busName: "ZHY", location: "A’ershan", nominalKV: 34 },
  { busName: "ULK", location: "Van Nuys", nominalKV: 73 },
  { busName: "HHR", location: "Huolongmen", nominalKV: 3 },
  { busName: "ISS", location: "Changtang", nominalKV: 32 },
  { busName: "YBL", location: "Gorzyczki", nominalKV: 45 },
];

const page = async () => {
  const session = await getServerSession(authOptions);
  const { data: columns } = await getDefaultParams();
  const res = await Bus.insertMany(mockData);

  return (
    <PushMockData
      mockData={mockData}
      session={session}
      columns={columns[0].generatorColumns}
    />
  );
};

export default page;
