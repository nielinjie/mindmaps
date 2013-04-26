/**
 * Creates a new InspectorView.
 *
 * @constructor
 */
mindmaps.InspectorView = function () {
    var self = this;
    var $content = $("#template-inspector").tmpl();
    var $sizeDecreaseButton = $("#inspector-button-font-size-decrease",
        $content);
    var $sizeIncreaseButton = $("#inspector-button-font-size-increase",
        $content);
    var $lineWidthDecreaseButton = $("#inspector-button-line-width-decrease",
        $content);
    var $lineWidthIncreaseButton = $("#inspector-button-line-width-increase",
        $content);
    var $boldCheckbox = $("#inspector-checkbox-font-bold", $content);
    var $italicCheckbox = $("#inspector-checkbox-font-italic", $content);
    var $underlineCheckbox = $("#inspector-checkbox-font-underline", $content);
    var $linethroughCheckbox = $("#inspector-checkbox-font-linethrough",
        $content);
    var $branchColorChildrenButton = $("#inspector-button-branch-color-children", $content);
    var branchColorPicker = $("#inspector-branch-color-picker", $content);
    var fontColorPicker = $("#inspector-font-color-picker", $content);
    var $allButtons = [ $sizeDecreaseButton, $sizeIncreaseButton,
        $lineWidthDecreaseButton, $lineWidthIncreaseButton,
        $boldCheckbox, $italicCheckbox, $underlineCheckbox,
        $linethroughCheckbox, $branchColorChildrenButton ];
    var $allColorpickers = [ branchColorPicker, fontColorPicker ];
    var $notesTextArea = $("#inspector-notes-textarea", $content);


    /**
     * Returns a jquery object.
     *
     * @returns {jQuery}
     */
    this.getContent = function () {
        return $content;
    };

    /**
     * Sets the enabled state of all controls.
     *
     * @param {Boolean} enabled
     */
    this.setControlsEnabled = function (enabled) {
        var state = enabled ? "enable" : "disable";
        $allButtons.forEach(function ($button) {
            $button.button(state);
        });

        $allColorpickers.forEach(function ($colorpicker) {
            $colorpicker.attr('disabled', enabled)
        });

        _.chain(mindmaps.plugins).sortBy("startOrder").each(function (v, k) {
            if (v.inspectorAdviser) {
                if (v.inspectorAdviser.setControlsEnabled) {
                    v.inspectorAdviser.setControlsEnabled(enabled)
                }
            }
        })
    };

    /**
     * Sets the checked state of the bold font option.
     *
     * @param {Boolean} checked
     */
    this.setBoldCheckboxState = function (checked) {
        $boldCheckbox.prop("checked", checked).button("refresh");
    };

    /**
     * Sets the checked state of the italic font option.
     *
     * @param {Boolean} checked
     */
    this.setItalicCheckboxState = function (checked) {
        $italicCheckbox.prop("checked", checked).button("refresh");
    };

    /**
     * Sets the checked state of the underline font option.
     *
     * @param {Boolean} checked
     */
    this.setUnderlineCheckboxState = function (checked) {
        $underlineCheckbox.prop("checked", checked).button("refresh");
    };

    /**
     * Sets the checked state of the linethrough font option.
     *
     * @param {Boolean} checked
     */
    this.setLinethroughCheckboxState = function (checked) {
        $linethroughCheckbox.prop("checked", checked).button("refresh");
    };

    /**
     * Sets the color of the branch color picker.
     *
     * @param {String} color
     */
    this.setBranchColorPickerColor = function (color) {
        branchColorPicker.val(color).change();
    };

    /**
     * Sets the color of the font color picker.
     *
     * @param {String} color
     */
    this.setFontColorPickerColor = function (color) {
        fontColorPicker.val(color).change();
    }
    /**
     * Sets the contents of the notes text area.
     *
     * @param {String} text
     */
    this.setNotesTextAreaContents = function (text) {
        $notesTextArea.val(text)
    };

    /**
     * Initialise
     */
    this.init = function () {
        $(".buttonset", $content).buttonset();
        $branchColorChildrenButton.button();

        $sizeDecreaseButton.click(function () {
            if (self.fontSizeDecreaseButtonClicked) {
                self.fontSizeDecreaseButtonClicked();
            }
        });

        $sizeIncreaseButton.click(function () {
            if (self.fontSizeIncreaseButtonClicked) {
                self.fontSizeIncreaseButtonClicked();
            }
        });

        $lineWidthDecreaseButton.click(function () {
            if (self.lineWidthDecreaseButtonClicked) {
                self.lineWidthDecreaseButtonClicked();
            }
        });

        $lineWidthIncreaseButton.click(function () {
            if (self.lineWidthIncreaseButtonClicked) {
                self.lineWidthIncreaseButtonClicked();
            }
        });

        $boldCheckbox.click(function () {
            if (self.fontBoldCheckboxClicked) {
                var checked = $(this).prop("checked");
                self.fontBoldCheckboxClicked(checked);
            }
        });

        $italicCheckbox.click(function () {
            if (self.fontItalicCheckboxClicked) {
                var checked = $(this).prop("checked");
                self.fontItalicCheckboxClicked(checked);
            }
        });

        $underlineCheckbox.click(function () {
            if (self.fontUnderlineCheckboxClicked) {
                var checked = $(this).prop("checked");
                self.fontUnderlineCheckboxClicked(checked);
            }
        });

        $linethroughCheckbox.click(function () {
            if (self.fontLinethroughCheckboxClicked) {
                var checked = $(this).prop("checked");
                self.fontLinethroughCheckboxClicked(checked);
            }
        });


        branchColorPicker.colorPicker({pickerDefault: mindmaps.Util.colors20[0], colors: mindmaps.Util.colors20})
        branchColorPicker.change(function () {
            var currentColour = $(this).val()
            if (currentColour)
                if (self.branchColorPicked) {
                    self.branchColorPicked(currentColour);
                }
        })

        fontColorPicker.colorPicker({pickerDefault: mindmaps.Util.colors20[0], colors: mindmaps.Util.colors20})
        fontColorPicker.change(function () {
            var currentColour = $(this).val()
            if (currentColour)
                if (self.fontColorPicked) {
                    self.fontColorPicked(currentColour);
                }
        })


        $branchColorChildrenButton.click(function () {
            if (self.branchColorChildrenButtonClicked) {
                self.branchColorChildrenButtonClicked();
            }
        });





        $notesTextArea.bind('change keyup', function (changeEvent) {
            self.notesTextAreaChanged($notesTextArea.val());
        });


        _.chain(mindmaps.plugins).sortBy("startOrder").each(function (v, k) {
            if (v.inspectorAdviser) {
                if (v.inspectorAdviser.onInit) {
                    v.inspectorAdviser.onInit($("#inspector-table", $content))
                }
            }
        })
    };
};

/**
 * Creates a new InspectorPresenter. This presenter manages basic node
 * attributes like font settings and branch color.
 *
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.InspectorView} view
 */
mindmaps.InspectorPresenter = function (eventBus, mindmapModel, commandRegistry, view) {
    var self = this;

    /**
     * View callbacks: React to user input and execute appropiate action.
     */

    view.fontSizeDecreaseButtonClicked = function () {
        var action = new mindmaps.action.DecreaseNodeFontSizeAction(
            mindmapModel.selectedNode);
        mindmapModel.executeAction(action);
    };

    view.fontSizeIncreaseButtonClicked = function () {
        var action = new mindmaps.action.IncreaseNodeFontSizeAction(
            mindmapModel.selectedNode);
        mindmapModel.executeAction(action);
    };

    view.lineWidthDecreaseButtonClicked = function () {
        var action = new mindmaps.action.DecreaseNodeLineWidthAction(
            mindmapModel.selectedNode);
        mindmapModel.executeAction(action);
    };

    view.lineWidthIncreaseButtonClicked = function () {
        var action = new mindmaps.action.IncreaseNodeLineWidthAction(
            mindmapModel.selectedNode);
        mindmapModel.executeAction(action);
    };

    view.fontBoldCheckboxClicked = function (checked) {
        var action = new mindmaps.action.SetFontWeightAction(
            mindmapModel.selectedNode, checked);
        mindmapModel.executeAction(action);
    };

    view.fontItalicCheckboxClicked = function (checked) {
        var action = new mindmaps.action.SetFontStyleAction(
            mindmapModel.selectedNode, checked);
        mindmapModel.executeAction(action);
    };

    view.fontUnderlineCheckboxClicked = function (checked) {
        var action = new mindmaps.action.SetFontDecorationAction(
            mindmapModel.selectedNode, checked ? "underline" : "none");
        mindmapModel.executeAction(action);
    };

    view.fontLinethroughCheckboxClicked = function (checked) {
        var action = new mindmaps.action.SetFontDecorationAction(
            mindmapModel.selectedNode, checked ? "line-through" : "none");
        mindmapModel.executeAction(action);
    };

    view.branchColorPicked = function (color) {
        var action = new mindmaps.action.SetBranchColorAction(mindmapModel.selectedNode, color);
        mindmapModel.executeAction(action);
    };

    view.branchColorPreview = function (color) {
        eventBus.publish(mindmaps.Event.NODE_BRANCH_COLOR_PREVIEW,
            mindmapModel.selectedNode, color);
    }

    view.fontColorPicked = function (color) {
        var action = new mindmaps.action.SetFontColorAction(
            mindmapModel.selectedNode, color);
        mindmapModel.executeAction(action);
    };

    view.fontColorPreview = function (color) {
        eventBus.publish(mindmaps.Event.NODE_FONT_COLOR_PREVIEW,
            mindmapModel.selectedNode, color);
    };

    /**
     * Change branch color of all the node's children.
     */
    view.branchColorChildrenButtonClicked = function () {
        var action = new mindmaps.action.SetChildrenBranchColorAction(
            mindmapModel.selectedNode);
        mindmapModel.executeAction(action);
    }


    view.notesTextAreaChanged = function (text) {
        var action = new mindmaps.action.ChangeNotesAction(
            mindmapModel.selectedNode, text);
        mindmapModel.executeAction(action);
    }


    /**
     * Update view on font events.
     */
    eventBus.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function (node) {
        if (mindmapModel.selectedNode === node) {
            updateView(node);
        }
    });

    eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED,
        function (node) {
            if (mindmapModel.selectedNode === node) {
                updateView(node);
            }
        });

    eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function (node) {
        updateView(node);
    });

    /**
     * Enable controls when a document has been opened.
     */
    eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function () {
        view.setControlsEnabled(true);
    });

    /**
     * Disable controls when document was closed.
     */
    eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function () {
        view.setControlsEnabled(false);
    });

    /**
     * Sets the view params to match the node's attributes.
     *
     * @param {mindmaps.Node} node
     */
    function updateView(node) {
        var font = node.text.font;
        view.setBoldCheckboxState(font.weight === "bold");
        view.setItalicCheckboxState(font.style === "italic");
        view.setUnderlineCheckboxState(font.decoration === "underline");
        view.setLinethroughCheckboxState(font.decoration === "line-through");
        view.setFontColorPickerColor(font.color);
        view.setBranchColorPickerColor(node.branchColor);
        view.setNotesTextAreaContents(node.notes);


    }

    this.go = function () {
        view.init();
    };
};
