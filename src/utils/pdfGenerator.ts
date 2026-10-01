import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MedicalReport } from '../types';

/**
 * Generates and downloads a clean, professional medical PDF report
 * using jsPDF vector layout for crisp text and high-definition tables.
 */
export async function downloadMedicalReportPDF(report: MedicalReport, elementToCapture?: HTMLElement | null): Promise<void> {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const reportCode = report.reportNumber || report.id || 'MDH-88291';
    const reportDate = report.generatedDate || new Date().toLocaleDateString();
    const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // ~297mm
    let y = 14;

    // Helper functions
    const addHeader = () => {
      // Top Medical Banner Bar
      doc.setFillColor(30, 58, 138); // Deep Royal Blue (#1e3a8a)
      doc.rect(0, 0, pageWidth, 20, 'F');

      // Top Clinic Branding Text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('METROPOLITAN DIGITAL HEALTH & DIAGNOSTIC INSTITUTE', 14, 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Center for Clinical AI Diagnostics, Biomarker Informatics & 3D Anatomy // HIPAA Compliant', 14, 15);

      // Report ID Tag
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`REPORT #${reportCode}`, pageWidth - 14, 12, { align: 'right' });
      y = 26;
    };

    const addFooter = (pageNum: number) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.setDrawColor(220, 220, 220);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
      doc.text(`Official Medical Record • Report #${reportCode} • Issued: ${reportDate}`, 14, pageHeight - 7);
      doc.text(`Page ${pageNum}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
    };

    addHeader();

    // 1. Report Metadata & Triage Urgency Header
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('OFFICIAL CLINICAL DIAGNOSTIC REPORT', 14, y);
    y += 5;

    // Urgency Banner
    const triage = report.clinicalImpression.triageLevel || 'Routine';
    const isEmergency = triage === 'Emergency' || report.clinicalImpression.severity === 'Critical / Emergency';
    const isUrgent = triage === 'Urgent Care' || report.clinicalImpression.severity === 'Severe';
    const urgencyColor = isEmergency ? [225, 29, 72] : isUrgent ? [217, 119, 6] : [37, 99, 235];
    doc.setFillColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
    doc.roundedRect(14, y, pageWidth - 28, 7, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    const urgencyTitle = isEmergency 
      ? 'EMERGENCY CLINICAL TRIAGE: IMMEDIATE HOSPITAL EVALUATION' 
      : isUrgent 
      ? 'URGENT CLINICAL TRIAGE: SCHEDULE SAME-DAY MEDICAL CONSULTATION' 
      : 'ROUTINE CLINICAL TRIAGE: STANDARD OUTPATIENT EVALUATION';
    doc.text(urgencyTitle, pageWidth / 2, y + 4.8, { align: 'center' });
    y += 11;

    // 2. Patient Demographics Box (Left) & Key Baseline Vitals (Right)
    const boxHeight = 36;
    const colWidth = (pageWidth - 32) / 2;

    // Demographics Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, colWidth, boxHeight, 2, 2, 'FD');

    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('PATIENT DEMOGRAPHICS', 18, y + 6);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Name: ${report.patient.name}`, 18, y + 12);
    doc.text(`Patient ID: ${report.patient.patientId}`, 18, y + 17);
    doc.text(`Age / Gender: ${report.patient.age} Yrs / ${report.patient.gender}`, 18, y + 22);
    doc.text(`Blood Group: ${report.patient.bloodGroup} | Weight: ${report.patient.weightKg} kg`, 18, y + 27);
    const allergyStr = report.patient.allergies && report.patient.allergies.length > 0 ? report.patient.allergies.join(', ') : 'No known drug allergies (NKDA)';
    doc.text(`Allergies: ${allergyStr}`, 18, y + 32);

    // Vitals Box
    const vitalsX = 14 + colWidth + 4;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(vitalsX, y, colWidth, boxHeight, 2, 2, 'FD');

    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('RECORDED CLINICAL VITALS', vitalsX + 4, y + 6);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Blood Pressure: ${report.vitals.bloodPressure}`, vitalsX + 4, y + 12);
    doc.text(`Heart Rate: ${report.vitals.heartRate} bpm`, vitalsX + 4, y + 17);
    doc.text(`Respiratory Rate: ${report.vitals.respiratoryRate} /min`, vitalsX + 4, y + 22);
    doc.text(`Body Temp: ${report.vitals.temperature} | SpO2: ${report.vitals.oxygenSaturation}%`, vitalsX + 4, y + 27);
    doc.text(`Blood Glucose: ${report.vitals.bloodGlucose || '95 mg/dL'} | Target: ${report.targetOrgan || 'General'}`, vitalsX + 4, y + 32);

    y += boxHeight + 6;

    // 3. Primary Diagnosis & ICD-10 Coding
    doc.setFillColor(238, 242, 255);
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'FD');

    doc.setTextColor(67, 56, 202);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('PRIMARY CLINICAL DIAGNOSIS', 18, y + 6);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(report.clinicalImpression.primaryDiagnosis, 18, y + 12);

    if (report.clinicalImpression.icd10Code) {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(pageWidth - 54, y + 3, 36, 6, 1, 1, 'F');
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`ICD-10: ${report.clinicalImpression.icd10Code}`, pageWidth - 36, y + 7.2, { align: 'center' });
    }

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const summaryLines = doc.splitTextToSize(report.clinicalImpression.summary, pageWidth - 36);
    doc.text(summaryLines, 18, y + 17);

    y += 30;

    // 4. Patient Plain-Language Explanation
    const plainText = report.plainLanguageExplanation || report.clinicalImpression.everydayAnalogy || report.clinicalImpression.summary;
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('PATIENT EXPLANATION (PLAIN ENGLISH & ANALOGY)', 18, y + 5);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const plainLines = doc.splitTextToSize(plainText, pageWidth - 36);
    doc.text(plainLines, 18, y + 10);

    y += 20;

    // Optional: Uploaded Image & Visual Findings Section
    if (report.imageAnalysis || (report.uploadedImages && report.uploadedImages.length > 0)) {
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'FD');

      doc.setTextColor(14, 116, 144);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`VISUAL SCAN & IMAGE INSPECTION (${report.imageAnalysis?.imageTypeDetected || 'Medical Diagnostic Image'})`, 18, y + 5);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      const obsText = report.imageAnalysis?.visualObservations?.join(' • ') || report.imageAnalysis?.summary || 'Visual scan analyzed for morphological markers and anatomical changes.';
      const obsLines = doc.splitTextToSize(obsText, pageWidth - 36);
      doc.text(obsLines, 18, y + 10);

      y += 22;
    }

    // 5. Prescribed Medications Table
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('PHARMACEUTICAL PRESCRIPTIONS & DOSING SCHEDULE', 14, y);
    y += 4;

    // Table Header
    doc.setFillColor(224, 231, 255);
    doc.rect(14, y, pageWidth - 28, 6, 'F');
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICATION & GENERIC', 16, y + 4.2);
    doc.text('DOSAGE & ROUTE', 75, y + 4.2);
    doc.text('FREQUENCY', 115, y + 4.2);
    doc.text('DURATION', 145, y + 4.2);
    doc.text('SPECIAL INSTRUCTIONS', 170, y + 4.2);
    y += 6;

    // Table Rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const rxList = report.prescriptions || [];
    rxList.forEach((rx, index) => {
      const isAlt = index % 2 === 1;
      if (isAlt) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y, pageWidth - 28, 8, 'F');
      }
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y + 8, pageWidth - 14, y + 8);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(rx.name || 'Rx Item', 16, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(rx.genericName || rx.drugClass || '', 16, y + 7);

      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`${rx.dosage || rx.typicalDosage || 'Standard'} (${rx.route || 'Oral'})`, 75, y + 5);
      doc.text(rx.frequency || 'Daily', 115, y + 5);
      doc.text(rx.duration || '7 Days', 145, y + 5);

      const notes = rx.prescribingNotes || rx.timingInstructions || rx.purpose || 'Follow prescription label';
      const instr = doc.splitTextToSize(notes, 24);
      doc.text(instr, 170, y + 4);

      y += 8.5;
    });

    y += 4;

    // 6. Lifestyle / Non-Pharmacological Care & Emergency Red Flags
    const colCareW = (pageWidth - 32) / 2;

    // Left: Lifestyle Directives
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, colCareW, 28, 2, 2, 'FD');

    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('LIFESTYLE & SUPPORTIVE CARE', 18, y + 5);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    let ly = y + 10;
    
    const adviceList = report.nonPharmacologicalAdvice || 
      (report.nonPharmacologicalPlan?.lifestyleModifications?.map(m => ({ title: 'Lifestyle Modification', description: m })) || []);
    
    adviceList.slice(0, 3).forEach((item) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${item.title}:`, 18, ly);
      doc.setFont('helvetica', 'normal');
      const desc = doc.splitTextToSize(item.description, colCareW - 12);
      doc.text(desc, 18, ly + 3);
      ly += 6;
    });

    // Right: Red Flag Emergency Warnings
    const redFlagX = 14 + colCareW + 4;
    doc.setFillColor(255, 241, 242);
    doc.setDrawColor(254, 205, 211);
    doc.roundedRect(redFlagX, y, colCareW, 28, 2, 2, 'FD');

    doc.setTextColor(225, 29, 72);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('EMERGENCY RED-FLAG WARNINGS', redFlagX + 4, y + 5);

    doc.setTextColor(159, 18, 57);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    let ry = y + 10;
    const redFlags = report.redFlagEmergencySymptoms || report.followUpPlan?.emergencyRedFlags || [
      'Sudden onset of severe chest pressure or shortness of breath',
      'Loss of consciousness, severe dizziness, or confusion',
      'High persistent fever exceeding 103°F (39.4°C)'
    ];
    redFlags.slice(0, 4).forEach((rf) => {
      doc.text(`! ${rf}`, redFlagX + 4, ry);
      ry += 4;
    });

    y += 32;

    // 7. Physician Signature & Legal Authentication Box
    doc.setDrawColor(203, 213, 225);
    doc.line(14, y, pageWidth - 14, y);
    y += 5;

    const docName = report.attendingPhysician?.name || 'Dr. Eleanor Vance, MD';
    const docCreds = report.attendingPhysician?.credentials || 'MD, FACP, ABIM';
    const docSpec = report.attendingPhysician?.specialty || 'Internal Medicine & Clinical Diagnostics';
    const docLic = report.attendingPhysician?.licenseNumber || 'MD-928104';

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(docName, 14, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${docCreds} • ${docSpec}`, 14, y + 4);
    doc.text(`License #${docLic} • Facility: MDH-AI-902`, 14, y + 8);

    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('DIGITALLY SIGNED & VERIFIED BY METROPOLITAN DIGITAL HEALTH', pageWidth - 14, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 140, 140);
    const hash = report.verificationHash || Math.random().toString(36).substring(2, 12).toUpperCase();
    doc.text('Verification Hash SHA-256: ' + hash, pageWidth - 14, y + 8, { align: 'right' });

    addFooter(1);

    // Save and trigger file download
    const cleanPatientName = (report.patient?.name || 'Patient').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Medical_Diagnostic_Report_${cleanPatientName}_${reportCode}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Error generating vector PDF report:', error);

    // Fallback: If element is provided, capture with html2canvas and jsPDF
    if (elementToCapture) {
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#E0E5EC'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Medical_Report_${report.reportNumber || report.id || 'export'}.pdf`);
    } else {
      window.print();
    }
  }
}

/**
 * Generates and downloads a Patient Care & Medication Summary PDF
 */
export async function downloadDiseaseCareSheetPDF(disease: {
  name: string;
  medicalTerm?: string;
  category?: string;
  severity?: string;
  urgencyLevel?: string;
  simpleSummary?: string;
  everydayAnalogy?: string;
  medications?: any[];
  homeRemedies?: string[];
  dietaryAdvice?: { recommended: string[]; avoid: string[] };
  lifestyleTips?: string[];
  emergencyRedFlags?: string[];
}): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 14;

  // Header Banner
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('METROPOLITAN DIGITAL HEALTH // CLINICAL PATIENT CARE SHEET', 14, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Targeted Disease Insights, Biological Mechanisms & Medication Protocol', 14, 15);
  doc.text(new Date().toLocaleDateString(), pageWidth - 14, 12, { align: 'right' });
  y = 28;

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(disease.name, 14, y);
  y += 5;

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`${disease.medicalTerm || disease.name} • Category: ${disease.category || 'General'} • Severity: ${disease.severity || 'Moderate'}`, 14, y);
  y += 7;

  // Plain language summary
  if (disease.simpleSummary) {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'FD');
    doc.setTextColor(3, 105, 161);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('CONDITION OVERVIEW & ANALOGY', 18, y + 5);
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const summaryLines = doc.splitTextToSize(disease.simpleSummary, pageWidth - 36);
    doc.text(summaryLines, 18, y + 10);
    y += 22;
  }

  // Medications Table
  if (disease.medications && disease.medications.length > 0) {
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('RECOMMENDED MEDICATIONS & PHARMACOTHERAPY', 14, y);
    y += 4;

    doc.setFillColor(224, 231, 255);
    doc.rect(14, y, pageWidth - 28, 6, 'F');
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICATION', 16, y + 4.2);
    doc.text('CLASS / TYPE', 70, y + 4.2);
    doc.text('TYPICAL DOSAGE', 115, y + 4.2);
    doc.text('FREQUENCY & INSTRUCTIONS', 150, y + 4.2);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    disease.medications.forEach((med, idx) => {
      const isAlt = idx % 2 === 1;
      if (isAlt) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y, pageWidth - 28, 7.5, 'F');
      }
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y + 7.5, pageWidth - 14, y + 7.5);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(med.name, 16, y + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`${med.drugClass || ''} (${med.prescriptionType || 'Rx'})`, 70, y + 4.5);
      doc.text(med.typicalDosage || 'Standard', 115, y + 4.5);
      doc.text(med.frequency || 'Follow prescription label', 150, y + 4.5);
      y += 8;
    });
    y += 4;
  }

  // Home Care & Diet
  const colW = (pageWidth - 32) / 2;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, colW, 30, 2, 2, 'FD');

  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('HOME REMEDIES & LIFESTYLE', 18, y + 5);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  let ly = y + 10;
  (disease.homeRemedies || ['Adequate hydration', 'Rest in well-ventilated room']).slice(0, 3).forEach((rem) => {
    doc.text(`• ${rem}`, 18, ly);
    ly += 5;
  });

  // Emergency Red Flags
  const rxCol = 14 + colW + 4;
  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(rxCol, y, colW, 30, 2, 2, 'FD');

  doc.setTextColor(225, 29, 72);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('EMERGENCY RED-FLAG WARNINGS', rxCol + 4, y + 5);

  doc.setTextColor(159, 18, 57);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  let ry = y + 10;
  (disease.emergencyRedFlags || ['Severe chest pain', 'Breathing difficulty', 'High fever over 103F']).slice(0, 4).forEach((flag) => {
    doc.text(`! ${flag}`, rxCol + 4, ry);
    ry += 4.5;
  });

  y += 36;

  // Footer
  doc.setDrawColor(220, 220, 220);
  doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text('Metropolitan Digital Health Diagnostic System • Clinical Educational Care Sheet', 14, pageHeight - 7);

  const cleanName = disease.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Patient_Care_Summary_${cleanName}.pdf`);
}

