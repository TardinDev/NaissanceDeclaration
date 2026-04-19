package com.mairie.declaration.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.mairie.declaration.entity.Declaration;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class BirthCertificatePdfService {

    private static final DeviceRgb PRIMARY = new DeviceRgb(27, 94, 32);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generate(Declaration d) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             PdfWriter writer = new PdfWriter(out);
             PdfDocument pdf = new PdfDocument(writer);
             Document doc = new Document(pdf)) {

            doc.add(new Paragraph("RÉPUBLIQUE FRANÇAISE")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(14)
                    .setFontColor(PRIMARY));

            doc.add(new Paragraph("Mairie – Service de l'état civil")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.DARK_GRAY));

            doc.add(new Paragraph("ACTE DE NAISSANCE")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(20)
                    .setMarginTop(20)
                    .setMarginBottom(10));

            doc.add(new Paragraph("Référence : " + d.getReference())
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginBottom(20));

            doc.add(section("Enfant"));
            doc.add(twoCol()
                    .addCell(label("Nom"))
                    .addCell(value(d.getChildLastName()))
                    .addCell(label("Prénom(s)"))
                    .addCell(value(d.getChildFirstNames()))
                    .addCell(label("Date de naissance"))
                    .addCell(value(d.getChildBirthDate() != null ? d.getChildBirthDate().format(DATE_FMT) : "-"))
                    .addCell(label("Lieu de naissance"))
                    .addCell(value(d.getChildBirthPlace()))
                    .addCell(label("Sexe"))
                    .addCell(value(d.getChildGender())));

            doc.add(section("Père"));
            doc.add(twoCol()
                    .addCell(label("Nom"))
                    .addCell(value(safe(d.getFatherLastName())))
                    .addCell(label("Prénom(s)"))
                    .addCell(value(safe(d.getFatherFirstNames()))));

            doc.add(section("Mère"));
            doc.add(twoCol()
                    .addCell(label("Nom"))
                    .addCell(value(d.getMotherLastName()))
                    .addCell(label("Prénom(s)"))
                    .addCell(value(d.getMotherFirstNames())));

            doc.add(section("Déclarant"));
            doc.add(twoCol()
                    .addCell(label("Nom"))
                    .addCell(value(d.getDeclarantLastName()))
                    .addCell(label("Prénom(s)"))
                    .addCell(value(d.getDeclarantFirstNames()))
                    .addCell(label("Qualité"))
                    .addCell(value(d.getDeclarantQuality())));

            doc.add(new Paragraph("Délivré le " + java.time.LocalDate.now().format(DATE_FMT))
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setFontSize(10)
                    .setItalic()
                    .setMarginTop(30));

            doc.add(new Paragraph("Document officiel – Ne pas modifier")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginTop(40));

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Erreur lors de la génération du PDF", e);
        }
    }

    private Paragraph section(String title) {
        return new Paragraph(title)
                .setBold()
                .setFontSize(13)
                .setFontColor(PRIMARY)
                .setMarginTop(15)
                .setMarginBottom(5);
    }

    private Table twoCol() {
        Table table = new Table(UnitValue.createPercentArray(new float[]{30, 70}))
                .useAllAvailableWidth();
        table.setBorder(Border.NO_BORDER);
        return table;
    }

    private Cell label(String text) {
        return new Cell().add(new Paragraph(text).setFontColor(ColorConstants.DARK_GRAY).setFontSize(10))
                .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
    }

    private Cell value(String text) {
        return new Cell().add(new Paragraph(text != null ? text : "-").setBold().setFontSize(11))
                .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
    }

    private String safe(String s) {
        return s == null || s.isBlank() ? "-" : s;
    }
}
