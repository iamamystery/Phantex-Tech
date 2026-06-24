from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import HowWeWorkSettings, WorkProcessStep

@admin.register(HowWeWorkSettings)
class HowWeWorkSettingsAdmin(ModelAdmin):
    list_display = ('__str__', 'section_label', 'title_line_1', 'title_line_2_highlight')

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(WorkProcessStep)
class WorkProcessStepAdmin(ModelAdmin):
    list_display = ('phase_number', 'title', 'order', 'theme_color')
    list_editable = ('order',)
    search_fields = ('title', 'phase_number', 'phase_label')
    ordering = ('order',)
