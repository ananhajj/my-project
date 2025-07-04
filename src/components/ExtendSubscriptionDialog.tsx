
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface School {
  id: string;
  subscription_id: string;
  school_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'expired';
  subscription_end?: string;
  students_count: number;
  created_at: string;
  updated_at: string;
}

interface SubscriptionForm {
  months: number;
}

interface ExtendSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: School | null;
  onConfirm: (months: number) => void;
}

const ExtendSubscriptionDialog = ({ 
  open, 
  onOpenChange, 
  school, 
  onConfirm 
}: ExtendSubscriptionDialogProps) => {
  const { toast } = useToast();
  const subscriptionForm = useForm<SubscriptionForm>();

  const onSubmit = (data: SubscriptionForm) => {
    if (!school) return;
    
    onConfirm(data.months);
    subscriptionForm.reset();
    onOpenChange(false);
    
    toast({
      title: "تم تمديد الاشتراك",
      description: `تم تمديد اشتراك ${school.school_name} لمدة ${data.months} شهر`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تمديد الاشتراك</DialogTitle>
          <DialogDescription>
            تمديد اشتراك {school?.school_name}
          </DialogDescription>
        </DialogHeader>
        <Form {...subscriptionForm}>
          <form onSubmit={subscriptionForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={subscriptionForm.control}
              name="months"
              rules={{ 
                required: "عدد الأشهر مطلوب",
                min: { value: 1, message: "أقل عدد شهر واحد" },
                max: { value: 24, message: "أقصى عدد 24 شهر" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الأشهر</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      placeholder="6"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              تمديد الاشتراك
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExtendSubscriptionDialog;
