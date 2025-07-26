import React, { useState } from "react";
import { Alert } from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { databaseService } from "../lib/database";
import { generatePDFContent } from "../lib/utils";

interface ExportButtonProps {
  variant?: "contained" | "outlined" | "text";
  style?: any;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  variant = "contained",
  style,
}) => {
  const theme = useTheme();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Get all mood entries
      const entries = await databaseService.getAllMoodEntries();

      if (entries.length === 0) {
        Alert.alert(
          "Tidak Ada Data",
          "Belum ada catatan mood untuk di-export. Silakan tambahkan beberapa catatan terlebih dahulu.",
          [{ text: "OK" }]
        );
        return;
      }

      // Generate PDF content
      const htmlContent = generatePDFContent(entries);

      // Create PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Export Mood Diary",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert(
          "Export Berhasil",
          `PDF telah dibuat dan disimpan di: ${uri}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert(
        "Export Gagal",
        "Terjadi kesalahan saat mengexport data. Silakan coba lagi.",
        [{ text: "OK" }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      mode={variant}
      onPress={handleExport}
      loading={isExporting}
      disabled={isExporting}
      icon="download"
      style={style}
      buttonColor={variant === "contained" ? theme.colors.primary : undefined}
      textColor={
        variant === "contained" ? theme.colors.onPrimary : theme.colors.primary
      }
    >
      {isExporting ? "Mengexport..." : "Export ke PDF"}
    </Button>
  );
};
