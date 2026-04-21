"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ReusableForm, { FormField } from "../../../components/ReusableForm";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  const patientFields: FormField[] = [
    { name: "hn_number", label: "หมายเลข HN", type: "text", required: true },
    {
      name: "patient_name",
      label: "ชื่อ-นามสกุล คนไข้",
      type: "text",
      required: true,
    },
    {
      name: "exam_date",
      label: "วันที่ตรวจ (YYYY-MM-DD)",
      type: "date",
      required: true,
    },
    {
      name: "diagnosis",
      label: "ผลการวินิจฉัยเบื้องต้น",
      type: "textarea",
      required: true,
    },
  ];

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/patients`,
        );
        if (response.ok) {
          const data = await response.json();
          const patient = data.find((p: any) => p.id === Number(params.id));
          if (patient) {
            setInitialData(patient);
          } else {
            alert("ไม่พบข้อมูลคนไข้ที่ต้องการแก้ไข");
            router.push("/admin/patients");
          }
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [params.id, router]);

  const handleUpdatePatient = async (formData: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/patients/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (response.ok) {
        alert("อัปเดตข้อมูลคนไข้สำเร็จ");
        router.push("/admin/patients");
      } else {
        alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl text-center mt-10">
        <p className="text-xl text-gray-700">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {initialData && (
        <ReusableForm
          title="แก้ไขประวัติคนไข้"
          fields={patientFields}
          initialData={initialData}
          onSubmit={handleUpdatePatient}
          onCancel={() => router.push("/admin/patients")}
        />
      )}
    </div>
  );
}
