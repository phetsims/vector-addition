// Copyright 2019, University of Colorado Boulder

/**
 * Base class for the Panel that appears on the upper-right corner of every screen respectively.
 *
 * Encapsulated class for all control panels but accommodates the different control panel content of each screen.
 * See https://github.com/phetsims/vector-addition/issues/79 for context.
 *
 * ## Ordering
 *  - Sum Checkboxes Container (optional)
 *  - Values Visible Checkbox
 *  - Angle Visible Checkbox (optional)
 *  - Grid Visible Checkbox
 *  - Line and Component style radio buttons (optional)
 *
 * Graph Control Panels are created at the start of the sim and are never disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Checkbox = require( 'SUN/Checkbox' );
  const ComponentStyleRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/ComponentStyleRadioButtonGroup' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const GridCheckbox = require( 'SCENERY_PHET/GridCheckbox' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  //----------------------------------------------------------------------------------------
  // constants
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;

  class GraphControlPanel extends Panel {

    /**
     * @param {BooleanProperty} valuesVisibleProperty - every graph control panel must have a 'Values' checkbox
     * @param {BooleanProperty} gridVisibleProperty - every graph control panel must have a 'Grid' checkbox
     * @param {Object} [options]
     */
    constructor( valuesVisibleProperty, gridVisibleProperty, options ) {

      options = _.extend( {}, VectorAdditionConstants.PANEL_OPTIONS, {

        // options that are specific to this class
        sumCheckboxContainer: null,   // {null|Node} Option to add a container of sum checkboxes. If null, no sum
                                      // checkbox container will be added to the panel. Sum checkboxes are made
                                      // externally since the number of sum checkboxes vary for different screens.

        angleVisibleProperty: null,   // {null|BooleanProperty} Option to pass a angle visible property. If non null, a
                                      // checkbox will be created to toggle this property. If null, no angle checkbox
                                      // will be made.

        componentStyleProperty: null, // {null|EnumerationProperty.<ComponentStyles>} Options to pass a
                                      // EnumerationProperty of the component styles. If non null, a
                                      // ComponentStyleRadioButtonGroup will be created to toggle the component style.
                                      // If null, no radio buttons will be made.

        // superclass options
        minWidth: 160,
        maxWidth: 160

      }, options );

      //----------------------------------------------------------------------------------------

      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( !options.sumCheckboxContainer || options.sumCheckboxContainer instanceof Node,
        `invalid options.sumCheckboxContainer: ${options.sumCheckboxContainer}` );
      assert && assert( !options.angleVisibleProperty || options.angleVisibleProperty instanceof BooleanProperty,
        `invalid options.angleVisibleProperty: ${options.angleVisibleProperty}` );
      assert && assert( !options.componentStyleProperty
                        || ComponentStyles.includes( options.componentStyleProperty.value ),
        `invalid componentStyleProperty: ${options.componentStyleProperty}` );

      //----------------------------------------------------------------------------------------
      const maxPanelContentWidth = options.maxWidth - 2 * options.xMargin;

      const panelContent = [];

      // Sum Checkboxes
      if ( options.sumCheckboxContainer ) {
        panelContent.push( options.sumCheckboxContainer );
      }

      // Values checkbox
      const valuesTextLength = maxPanelContentWidth - CHECKBOX_OPTIONS.boxWidth - CHECKBOX_OPTIONS.spacing;
      panelContent.push( new Checkbox( new Text( valuesString, {
          font: VectorAdditionConstants.PANEL_FONT,
          maxWidth: valuesTextLength
        } ),
        valuesVisibleProperty,
        CHECKBOX_OPTIONS ) );

      // Angle checkbox
      if ( options.angleVisibleProperty ) {
        panelContent.push( new Checkbox( VectorAdditionIconFactory.createAngleIcon(),
          options.angleVisibleProperty,
          CHECKBOX_OPTIONS ) );
      }

      // Grid checkbox
      panelContent.push( new GridCheckbox( gridVisibleProperty, _.extend( {}, CHECKBOX_OPTIONS, {
        gridSize: 24,
        gridStroke: VectorAdditionColors.GRID_ICON_COLOR
      } ) ) );

      //----------------------------------------------------------------------------------------
      // Component style radio buttons
      if ( options.componentStyleProperty ) {

        // Add a HSeparator
        const panelContentMaxWidth = _.maxBy( panelContent, node => node.width ).width;
        const panelContentWidth = _.max( [ panelContentMaxWidth, options.minWidth - 2 * options.xMargin ] );
        panelContent.push( new HSeparator( panelContentWidth, { stroke: VectorAdditionColors.BLACK } ) );

        // Create the 'Components' text
        const componentsText = new Text( componentsString, {
          font: VectorAdditionConstants.PANEL_FONT,
          maxWidth: maxPanelContentWidth
        } );
        panelContent.push( componentsText );

        // Create the radio buttons, centered in the panel
        const componentStyleRadioButtonGroup = new ComponentStyleRadioButtonGroup( options.componentStyleProperty );
        panelContent.push( new AlignBox( componentStyleRadioButtonGroup, {
          alignBounds: new Bounds2( 0, 0, panelContentWidth, componentStyleRadioButtonGroup.height ),
          maxWidth: panelContentWidth
        } ) );
      }

      //----------------------------------------------------------------------------------------
      // Create the panel
      super( new VBox( {
        children: panelContent,
        spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_SPACING,
        align: 'left'
      } ), options );
    }
  }

  return vectorAddition.register( 'GraphControlPanel', GraphControlPanel );
} );