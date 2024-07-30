import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components(shadcn)/ui/select";
import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "../ui/notiification/DataTable";
import { ArrowBigDownDash, Download, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components(shadcn)/ui/button";
import MakePayment from "./MakePayment";

const AaPaymentInvoicedetails = () => {
  const { id } = useParams();
  const months = [
    { id: "01", name: "January" },
    { id: "02", name: "February" },
    { id: "03", name: "March" },
    { id: "04", name: "April" },
    { id: "05", name: "May" },
    { id: "06", name: "June" },
    { id: "07", name: "July" },
    { id: "08", name: "August" },
    { id: "09", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => ({
    id: (currentYear - i).toString(),
    name: (currentYear - i).toString(),
  }));
  const [filters, setFilters] = useState({
    month: "",
    year: "",
  });
  const [selectedValues, setSelectedValues] = useState({
    month: "",
    year: "",
  });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      fetchBatches();
    }
  }, [filters]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${server}/invoice/monthly/query`,
        { assesmentAgencyId: id },
        {
          params: filters,
          withCredentials: true,
        }
      );
      setPaymentData(response.data.data);
      setIsDataFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
    setIsDataFetched(false);
  };

  const resetFilters = () => {
    setFilters({
      month: "",
      year: "",
    });
    setSelectedValues({
      month: "",
      year: "",
    });
    setIsDataFetched(false);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-start space-x-4">
          <Select
            value={selectedValues.month}
            onValueChange={(value) => handleFilterChange("month", value)}
          >
            <SelectTrigger className="w-fit border-0">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.id} value={month.name}>
                  {month.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedValues.year}
            onValueChange={(value) => handleFilterChange("year", value)}
          >
            <SelectTrigger className="w-fit border-0">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <div className="flex">
              <span className="font-semibold">Reset</span>
              <X
                onClick={resetFilters}
                className="w-4 cursor-pointer hover:cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {paymentData.month ? (
        <div className="p-8">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Agency Name</th>
                <th className="py-2 px-4 border-b">No of Exams</th>
                <th className="py-2 px-4 border-b">Total No of Candidates</th>
                <th className="py-2 px-4 border-b">No of Assessed Candidates</th>
                <th className="py-2 px-4 border-b">Total Amount to be Paid</th>
                <th className="py-2 px-4 border-b">Download Invoice</th>
                <th className="py-2 px-4 border-b">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-center">
                  {paymentData?.AssesmentAgencyDetails?.name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {paymentData?.examDetails?.length}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {paymentData?.totalNoOfcandidates}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {paymentData?.totalNoOfAssessedCandidates}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  ${paymentData?.totalAmountToBePaid}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <a
                    href={paymentData?.invoicePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    <Download className="ml-14" />
                  </a>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <MakePayment
                    invoice_id={paymentData?._id}
                    amountToPaid={paymentData?.totalAmountToBePaid}
                  >
                    <Button
                      className={`px-4 py-2 rounded-lg text-white ${
                        paymentData.paidAmount === 0
                          ? 'bg-green-500'
                          : 'bg-green-800'
                      }`}
                      disabled={paymentData.paidAmount !== 0}
                    >
                      {paymentData.paidAmount === 0 ? 'Pay' : 'Paid'}
                    </Button>
                  </MakePayment>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center">
          <p className="mt-5 text-2xl font-semibold text-green-900">
            Month and Year not selected!!!
          </p>
        </div>
      )}
    </div>
  );
};

export default AaPaymentInvoicedetails;

export const aAcolumn = [
  {
    accessorKey: "AssesmentAgencyDetails",
    header: "Agency Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium w-fit px-4 py-2 rounded-lg">
          {row.original.AssesmentAgencyDetails.name}
        </div>
      );
    },
  },
  {
    accessorKey: "examDetails",
    header: "No of Exams",
    cell: ({ row }) => {
      return (
        <div className="font-medium w-fit px-4 py-2 rounded-lg">
          {row.original.examDetails.length}
        </div>
      );
    },
  },
  {
    accessorKey: "totalNoOfcandidates",
    header: "Total No of Candidates",
  },
  {
    accessorKey: "totalNoOfAssessedCandidates",
    header: "No of Assessed Candidates",
  },
  {
    accessorKey: "totalAmountToBePaid",
    header: "Total Amount to be Paid",
  },
  {
    accessorKey: "invoicePdf",
    header: "Download Invoice",
    cell: ({ row }) => {
      const handleDownload = () => {
        const pdfUrl = row.getValue("invoicePdf");
        window.open(pdfUrl, "_blank");
      };
      return (
        <Button onClick={handleDownload}>
          <ArrowBigDownDash />
        </Button>
      );
    },
  },
  {
    accessorKey: "paidAmount",
    header: "Payment Status",
    cell: ({ row }) => {
      const paidStatus = row.getValue("paidAmount");
      const handleClick = () => {
        alert(`Action button clicked for row: ${row.original._id}`);
      };
      return (
        <Button
          onClick={handleClick}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          disabled={paidStatus != 0}
        >
          {paidStatus === 0 ? "Pay" : "Paid"}
        </Button>
      );
    },
  },
];

export const batchColumns = [
  {
    accessorKey: "AssesmentAgencyId",
    header: "Abn No",
  },
  {
    accessorKey: "invoiceGenerateDate",
    header: "Scheme Type",
  },
  {
    accessorKey: "transactionId",
    header: "Course",
  },
];
