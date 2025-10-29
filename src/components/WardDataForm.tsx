import { useState } from "react";
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

const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  age: z.string().min(1, "Age is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  relation: z.string().min(1, "Relation is required"),
  aadhaarNumber: z.string().optional(),
  voterId: z.string().optional(),
});

const formSchema = z.object({
  wardNumber: z.string().min(1, "Ward number is required"),
  boothNo: z.string().min(1, "Booth number is required"),
  cluster: z.string().min(1, "Cluster is required"),
  place: z.string().min(1, "Place is required").max(200),
  houseNumber: z.string().min(1, "House number is required").max(50),
  houseName: z.string().min(1, "House name is required").max(100),
  residency: z.enum(["owned", "rent", "lease"], { required_error: "Residency type is required" }),
  houseType: z.enum(["terrace", "roofTile", "sheet"], { required_error: "House type is required" }),
  rationCardType: z.enum(["red", "blue", "yellow", "white"], { required_error: "Ration card type is required" }),
  familyMembers: z.array(familyMemberSchema).min(1, "At least one family member is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function WardDataForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardNumber: "",
      boothNo: "",
      cluster: "",
      place: "",
      houseNumber: "",
      houseName: "",
      residency: undefined,
      houseType: undefined,
      rationCardType: undefined,
      familyMembers: [
        {
          name: "",
          age: "",
          gender: undefined,
          relation: "",
          aadhaarNumber: "",
          voterId: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "familyMembers",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Form submitted successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
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
            {/* Section 1: Household Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <CardTitle>Section 1: Household Information</CardTitle>
                </div>
                <CardDescription>All fields in this section are mandatory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="wardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ward Number *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose ward" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ward-1">Ward-1</SelectItem>
                            <SelectItem value="ward-2">Ward-2</SelectItem>
                            <SelectItem value="ward-3">Ward-3</SelectItem>
                            <SelectItem value="ward-16">Ward-16</SelectItem>
                            <SelectItem value="ward-17">Ward-17</SelectItem>
                            <SelectItem value="ward-18">Ward-18</SelectItem>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose cluster" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cluster-1">Cluster-1</SelectItem>
                            <SelectItem value="cluster-2">Cluster-2</SelectItem>
                            <SelectItem value="cluster-3">Cluster-3</SelectItem>
                            <SelectItem value="cluster-4">Cluster-4</SelectItem>
                            <SelectItem value="cluster-5">Cluster-5</SelectItem>
                            <SelectItem value="cluster-6">Cluster-6</SelectItem>
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
                          <Input placeholder="Enter house number" {...field} />
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
                        <FormLabel>House Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter house name" {...field} />
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
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
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
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
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
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
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

            {/* Section 2: Family Members */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>Section 2: Family Members</CardTitle>
                </div>
                <CardDescription>Add details for each family member (at least one required)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-6 rounded-lg border bg-muted/30 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Family Member {index + 1}</h3>
                      {fields.length > 1 && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <FormField
                        control={form.control}
                        name={`familyMembers.${index}.gender`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        name={`familyMembers.${index}.relation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relation *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Head, Spouse, Child" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`familyMembers.${index}.aadhaarNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aadhaar Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Optional" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`familyMembers.${index}.voterId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voter ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Optional" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      name: "",
                      age: "",
                      gender: undefined,
                      relation: "",
                      aadhaarNumber: "",
                      voterId: "",
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
