from django.db import models

class HowWeWorkSettings(models.Model):
    """Singleton model for configuring the main side-panel text of the How We Work section."""
    section_label = models.CharField(max_length=150, default="Our Process", help_text="Small uppercase label above the title")
    title_line_1 = models.CharField(max_length=150, default="HOW WE", help_text="First line of the main title")
    title_line_2_highlight = models.CharField(max_length=150, default="WORK", help_text="Second line of the title (often highlighted/colored)")
    description = models.TextField(default="From requirements to production — a battle-tested process that ships fast and scales clean.")

    def save(self, *args, **kwargs):
        # Guarantee it's a singleton
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    class Meta:
        verbose_name = "How We Work Settings"
        verbose_name_plural = "How We Work Settings"

    def __str__(self):
        return "How We Work Section Content"


class WorkProcessStep(models.Model):
    """Model for each individual card in the How We Work deck."""
    order = models.PositiveIntegerField(default=0, help_text="Order in which this card appears (0 is first)")
    phase_number = models.CharField(max_length=50, help_text="e.g. '01'")
    phase_label = models.CharField(max_length=150, help_text="e.g. 'PHASE ONE' or 'Discovery'")
    title = models.CharField(max_length=200, help_text="Main card title")
    description = models.TextField()
    tags = models.JSONField(default=list, help_text="List of string tags (e.g. ['Requirements Audit', 'Scope Definition'])")
    theme_color = models.CharField(max_length=50, default="#F5C518", help_text="Hex color code for this card's dynamic frosting/highlight (e.g. #F5C518)")

    class Meta:
        ordering = ['order']
        verbose_name = "Work Process Step"
        verbose_name_plural = "Work Process Steps"

    def __str__(self):
        return f"{self.phase_number} - {self.title}"
