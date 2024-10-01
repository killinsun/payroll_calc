// import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  Box,
  type BoxProps,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Layout from "./Layout.tsx";
import { colors } from "./themes/colors.ts";

const courseOptions = [
  { value: "80分9000", label: "80分 9,000円", price: 18000, salary: 9000 },
  { value: "100分10000", label: "100分 10,000円", price: 20000, salary: 10000 },
  { value: "120分12000", label: "120分 12,000円", price: 24000, salary: 12000 },
  { value: "150分15000", label: "150分 15,000円", price: 30000, salary: 15000 },
  { value: "180分18000", label: "180分 18,000円", price: 36000, salary: 18000 },
  { value: "延長3000", label: "延長 3,000円", price: 6000, salary: 3000 },
];

type Course = {
  name: string;
  isAssigned: boolean;
  isUsedCreditCard: boolean;
  discountAmount: number;
};

type CalculatorForm = {
  therapistName: string;
  courses: Course[];
};

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [scale, _setScale] = useState(1);

  const { control, handleSubmit, reset } = useForm<CalculatorForm>({
    defaultValues: {
      courses: [
        {
          name: "",
          isAssigned: false,
          isUsedCreditCard: false,
          discountAmount: 0,
        },
      ],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "courses",
  });

  const [totalSalary, setTotalSalary] = useState(0); // お給料
  const [totalPrice, setTotalPrice] = useState(0); // レジ残金

  const getAssignFee = (therapistName: string | undefined): number => {
    if (!therapistName) return 0;

    const assignFees: { [key: string]: number } = {
      "1": 1000,
      "2": 2000,
      "3": 3000,
      "１": 1000,
      "２": 2000,
      "３": 3000,
    };

    // 名前に１、２、３のいずれかが含まれているか確認
    const matchedChar = therapistName.split("").find((char) => {
      return Object.keys(assignFees).includes(char);
    });

    // マッチした文字があれば対応する指名料を返し、なければ0を返す
    return matchedChar ? assignFees[matchedChar] : 0;
  };

  const getCourseSales = (
    assignFee: number,
    course: Course,
  ): { sales: number; therapistSalary: number } => {
    /*
		コース別の売り上げを計算する。
		指名料、カード利用料、割引を考慮する。
		*/
    // クレジットカードの場合は計算しない
    if (course.isUsedCreditCard) {
      return { sales: 0, therapistSalary: 0 };
    }

    const courseOption =
      courseOptions.find((option) => option.value === course.name) || null;
    if (!courseOption) {
      return { sales: 0, therapistSalary: 0 };
    }

    const { price: baseCoursePrice, salary: baseCourseSalary } = courseOption;

    const coursePrice = course.isAssigned
      ? baseCoursePrice + assignFee - course.discountAmount
      : baseCoursePrice - course.discountAmount;
    const courseSalary = course.isAssigned
      ? baseCourseSalary + assignFee - course.discountAmount
      : baseCourseSalary - course.discountAmount;

    return {
      sales: coursePrice - courseSalary + 1000,
      therapistSalary: courseSalary - 1000,
    };
  };

  const handleClickApply = (data: CalculatorForm) => {
    const { therapistName, courses } = data;
    const assignFee = getAssignFee(therapistName);

    const totalCourseSales = courses.reduce((acc, course) => {
      const { sales } = getCourseSales(assignFee, course);
      return acc + sales;
    }, 0);
    const totalCourseSalary = courses.reduce((acc, course) => {
      const { therapistSalary } = getCourseSales(assignFee, course);
      return acc + therapistSalary;
    }, 0);

    setTotalSalary(totalCourseSalary);
    setTotalPrice(totalCourseSales);
  };

  // const handleClickScreenshot = () => {
  //   setScale(0.5);
  //   setTimeout(() => {
  //     window.print();
  //
  //     window.alert("スクリーンショットを撮影しました");
  //     setScale(1);
  //   }, 1000);
  // };

  return (
    <Layout>
      <ScaledContent scale={scale}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Controller
                name="therapistName"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    {...field}
                    label="姓"
                    variant="outlined"
                    size="small"
                    sx={{
                      flexGrow: 1,
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  display: "flex",
                  alignSelf: "stretch",
                  flexDirection: "column",
                  alignItems: "center",
                  borderBottom: `1px solid ${colors.gray[200]}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignSelf: "stretch",
                    gap: "4px",
                  }}
                >
                  <Controller
                    name={`courses.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <StyledSelect
                          {...field}
                          labelId={`course-select-label-${index}`}
                          size="small"
                        >
                          {courseOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name={`courses.${index}.discountAmount`}
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="割引"
                        variant="outlined"
                        type="number"
                      />
                    )}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignSelf: "stretch",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Controller
                    name={`courses.${index}.isAssigned`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <RadioGroup
                        {...field}
                        row
                        value={value ? "assigned" : "free"}
                        sx={{
                          display: "flex",
                          gap: "0px",
                        }}
                        onChange={(e) =>
                          onChange(e.target.value === "assigned")
                        }
                      >
                        <FormControlLabel
                          value="free"
                          control={<Radio />}
                          label="フリー"
                          sx={{
                            margin: "0px",
                            padding: "0px",
                            "& .MuiFormControlLabel-label": {
                              fontSize: {
                                xs: "0.7rem",
                                md: "1.0rem",
                              },
                            },
                          }}
                        />
                        <FormControlLabel
                          value="assigned"
                          control={<Radio />}
                          label="指名"
                          sx={{
                            margin: "0px",
                            padding: "0px",
                            "& .MuiFormControlLabel-label": {
                              fontSize: {
                                xs: "0.7rem",
                                md: "1.0rem",
                              },
                            },
                          }}
                        />
                      </RadioGroup>
                    )}
                  />
                  <Controller
                    name={`courses.${index}.isUsedCreditCard`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label={
                          isMobile ? (
                            <Tooltip title="クレジットカード" arrow>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <CreditCardIcon />
                                カード
                              </Box>
                            </Tooltip>
                          ) : (
                            "カード"
                          )
                        }
                        sx={{
                          margin: "0px",
                          padding: "0px",
                          "& .MuiFormControlLabel-label": {
                            fontSize: {
                              xs: "0.7rem",
                              md: "1.0rem",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Button
            onClick={() =>
              append({
                name: "",
                isAssigned: false,
                isUsedCreditCard: false,
                discountAmount: 0,
              })
            }
          >
            コースを追加
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit(handleClickApply)}
            >
              確定
            </Button>
            <Box
              sx={{
                display: "flex",
                gap: "16px",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  flex: "1",
                  border: "2px solid #000000",
                }}
              >
                <Typography>お給料: {totalSalary} 円</Typography>
              </Box>
              <Box sx={{ flex: "1", border: "2px solid #000000" }}>
                <Typography>レジ残金: {totalPrice} 円</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="body2" color="error">
                本日もお疲れ様でした。
              </Typography>
              <Typography variant="body2" color="error">
                この画面はお給料清算したら必ずスクリーンショットをしてラインに送ってください。
              </Typography>
              <Typography variant="body2" color="error">
                ゴミをだして鍵を戻すのもお忘れなく！！
              </Typography>
              <Typography variant="body2" color="error">
                ※金額のズレや打ち間違え、不足は次回補填していただくことになるので気をつけてください！
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <Button variant="text" color="error" onClick={() => reset()}>
                リセットする
              </Button>
              {/*<Button*/}
              {/*  variant="contained"*/}
              {/*  startIcon={<CameraAltIcon />}*/}
              {/*  onClick={handleClickScreenshot}*/}
              {/*>*/}
              {/*  スクリーンショットを撮影する*/}
              {/*</Button>*/}
            </Box>
          </Box>
        </Box>
      </ScaledContent>
    </Layout>
  );
}

export default App;

interface ScaledContentProps extends BoxProps {
  scale: number;
}

const ScaledContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "scale",
})<ScaledContentProps>(({ theme, scale }) => ({
  transform: `scale(${scale})`,
  transformOrigin: "top left",
  width: `${100 / scale}%`,
  height: `${100 / scale}%`,
  [theme.breakpoints.up("sm")]: {
    transform: "none",
    width: "100%",
    height: "auto",
  },
}));

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "40px",
  },
});

const StyledSelect = styled(Select)({
  "& .MuiSelect-select": {
    height: "32px",
  },
});
