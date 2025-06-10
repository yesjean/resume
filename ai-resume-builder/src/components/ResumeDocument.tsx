import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface Props {
  name: string;
  position: string;
  intro: string;
  experiences: {
    title: string;
    period: string;
    activities: string;
    learnings: string;
  }[];
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  section: { marginBottom: 20 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  expTitle: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  expPeriod: { fontSize: 12, fontStyle: "italic", marginBottom: 6 },
  expText: { marginBottom: 4 },
});

export const ResumeDocument: React.FC<Props> = ({
  name,
  position,
  intro,
  experiences,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>{name} - {position}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontWeight: "bold", marginBottom: 6 }}>자기소개서</Text>
        <Text>{intro}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontWeight: "bold", marginBottom: 6 }}>경력기술서</Text>
        {experiences.map((exp, i) => (
          <View key={i}>
            <Text style={styles.expTitle}>{exp.title}</Text>
            <Text style={styles.expPeriod}>{exp.period}</Text>
            <Text style={styles.expText}><Text style={{ fontWeight: "bold" }}>활동 내용: </Text>{exp.activities}</Text>
            <Text style={styles.expText}><Text style={{ fontWeight: "bold" }}>배운 점: </Text>{exp.learnings}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
