import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Plus, Trash2, Users, Home } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarField } from "./form-fields/CalendarField";





const employmentTypeEnum = z.enum(["selfEmployed", "business", "governmentJob", "professional", "privateSector", "agriculture"]);

const familyMemberSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
    age: z.string().min(1, "Age is required").regex(/^\d{1,3}$/, "Age must be numeric"),
    dateOfBirth: z.date({ required_error: "Date of birth is required" }),

    mobileNumber: z.string().optional(),
    maritalStatus: z.enum(["married", "unmarried", "widow/widower"], { required_error: "Marital status is required" }),
    employmentStatus: z.enum(["employed", "unemployed", "student", "child", "retired"], { required_error: "Employment status is required" }),
    employmentType: employmentTypeEnum.optional(),
    classCourse: z.string().optional(),
    institution: z.string().optional(),
    location: z.enum(["country", "abroad"], { required_error: "Current location is required" }),
    pensioner: z.enum(["yes", "no"], { required_error: "Pensioner information is required" }),
  })
  .superRefine((val, ctx) => {
    // employment type required when employed
    if (val.employmentStatus === "employed" && !val.employmentType) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Employment type is required when employed", path: ["employmentType"] });
    }

    // student must provide class/course and institution
    if (val.employmentStatus === "student") {
      if (!val.classCourse) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Class / course is required for students", path: ["classCourse"] });
      }
      if (!val.institution) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Studying institution is required for students", path: ["institution"] });
      }
    }

    // DOB validation
    // removed

  });

const formSchema = z.object({
  wardNumber: z.enum([
    "ward-1",
    "ward-2",
    "ward-3",
    "ward-4",
    "ward-5",
    "ward-6",
    "ward-7",
    "ward-8",
    "ward-9",
    "ward-10",
    "ward-11",
    "ward-12",
    "ward-13",
    "ward-14",
    "ward-15",
    "ward-16",
    "ward-17",
    "ward-18",
  ], { required_error: "Ward number is required" }),
  boothNo: z.enum(["booth-1", "booth-2"], { required_error: "Booth number is required" }),
  cluster: z.enum(["cluster-1", "cluster-2", "cluster-3", "cluster-4", "cluster-5", "cluster-6"], { required_error: "Cluster is required" }),
  place: z.string().min(1, "Place is required").max(200),
  houseNumber: z.string().regex(/^\d{3,4}$/, "House number must be a 3-4 digit number"),
  houseName: z.string().max(100).optional(), // not mandatory
  residency: z.enum(["owned", "rent", "lease"], { required_error: "Residency type is required" }),
  houseType: z.enum(["terrace", "roofTile", "sheet", "terraceRooftile"], { required_error: "House type is required" }),
  rationCardType: z.enum(["red", "blue", "yellow", "white"], { required_error: "Ration card type is required" }),
  familyMembers: z.array(familyMemberSchema).min(1, "At least one family member is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function WardDataForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardNumber: "ward-1",
      boothNo: "booth-1",
      cluster: "cluster-1",
      place: "",
      houseNumber: "",
      houseName: undefined,
      residency: undefined,
      houseType: undefined,
      rationCardType: undefined,
      familyMembers: [
        {
          name: "",
          gender: "male",
          age: "",
          dateOfBirth: undefined,
          mobileNumber: "",
          maritalStatus: "unmarried",
          employmentStatus: "unemployed",
          employmentType: undefined,
          classCourse: "",
          institution: "",
          location: "country",
          pensioner: "no",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "familyMembers" });

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => String(currentYear - i));

 const onSubmit = async (data: FormValues) => {
  setIsSubmitting(true);
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxk_moaS-W2szBukwaBtXnCSzvOdVF-UYfejBrkQn0eI18Akr8My1DIG3g6zuPlXeGw/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to submit");
    const result = await response.json();

    if (result.success) {
      toast.success("✅ Form submitted successfully and saved to Google Sheets!");
      form.reset();
    } else {
      throw new Error("Error saving to Google Sheets");
    }
  } catch (error) {
    console.error(error);
    toast.error("❌ Failed to submit form. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Ward Data Collection</h1>
          <p className="text-muted-foreground">Complete household and family information</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Household Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <CardTitle>Section 1: Household Information</CardTitle>
                </div>
                <CardDescription>All fields marked with * are mandatory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="wardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ward Number *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose ward" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 18 }, (_, i) => (
                              <SelectItem key={i} value={`ward-${i + 1}`}>
                                {`Ward-${i + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="boothNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booth Number *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose booth" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="booth-1">Booth-1</SelectItem>
                            <SelectItem value="booth-2">Booth-2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cluster"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cluster *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose cluster" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 6 }, (_, i) => (
                              <SelectItem key={i} value={`cluster-${i + 1}`}>
                                {`Cluster-${i + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter place" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="houseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="houseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="residency"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Residency *</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col space-y-2">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="owned" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Owned</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="rent" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Rent</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="lease" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Lease / Bogyam</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="houseType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>House Type *</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col space-y-2">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="terrace" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Terrace</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="roofTile" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Roof Tile</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="sheet" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Sheet</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="terraceRooftile" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Terrace + RoofTile</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rationCardType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Ration Card Type *</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col space-y-2">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="red" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">🔴 Red</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="blue" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">🔵 Blue</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yellow" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">🟡 Yellow</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="white" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">⚪ White</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Family Members */}
            <Card>
  <CardHeader>
    <div className="flex items-center gap-2">
      <Users className="w-5 h-5 text-primary" />
      <CardTitle>Section 2: Family Members</CardTitle>
    </div>
    <CardDescription>Add details for each family member (at least one required)</CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">
    {fields.map((fieldItem, index) => {
      const employmentStatus = form.watch(`familyMembers.${index}.employmentStatus`);
      const isStudent = employmentStatus === "student";
      const isEmployed = employmentStatus === "employed";

      return (
        <div key={fieldItem.id} className="p-6 rounded-lg border bg-muted/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Family Member {index + 1}</h3>
            {fields.length > 1 && (
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>

          {/* One field per line, mobile-first */}
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name={`familyMembers.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`familyMembers.${index}.gender`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`familyMembers.${index}.age`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth: full-width, one per line */}
           <CalendarField name={`familyMembers.${index}.dateOfBirth`} required />


            <FormField
              control={form.control}
              name={`familyMembers.${index}.mobileNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`familyMembers.${index}.maritalStatus`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="unmarried">Unmarried</SelectItem>
                      <SelectItem value="widow/widower">Widow/Widower</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`familyMembers.${index}.employmentStatus`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEmployed && (
              <FormField
                control={form.control}
                name={`familyMembers.${index}.employmentType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="selfEmployed">Self Employed</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="governmentJob">Government Job</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="privateSector">Private Sector</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isStudent && (
              <>
                <FormField
                  control={form.control}
                  name={`familyMembers.${index}.classCourse`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class / Course *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 10th / BSc CS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`familyMembers.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Studying Institution *</FormLabel>
                      <FormControl>
                        <Input placeholder="Institution name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name={`familyMembers.${index}.location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currently at country or abroad? *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="abroad">Abroad</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`familyMembers.${index}.pensioner`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whether pensioner or not? *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Yes or No" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );
    })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      name: "",
                      gender: "male",
                      age: "",
                      
                      mobileNumber: "",
                      maritalStatus: "unmarried",
                      employmentStatus: "unemployed",
                      employmentType: undefined,
                      classCourse: "",
                      institution: "",
                      location: "country",
                      pensioner: "no",
                    })
                  }
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Family Member
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button type="submit" size="lg" disabled={isSubmitting} className="px-12">
                {isSubmitting ? "Submitting..." : "Submit Form"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
