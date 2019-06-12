// Copyright 2019, University of Colorado Boulder

/**
 * Shows a Scenery Node that display the numerical magnitude, angle and components of a vector
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );


  // constants
  const VECTOR_PANEL_OPTIONS = {
    expandedProperty: new BooleanProperty( false ), // {Property.<boolean>}
    yMargin: 12,
    cornerRadius: 5,
    minWidth: 430,
    resize: false,
    fill: VectorAdditionColors.INSPECT_VECTOR_BACKGROUND,
    stroke: VectorAdditionColors.INSPECT_VECTOR_BORDER_COLOR
  };

  const EXPAND_COLLAPSE_BUTTON_CENTER_Y = -9;
  const EXPAND_COLLAPSE_BUTTON_LEFT_MARGIN = 5;
  const INSPECT_VECTOR_TEXT_LEFT_MARGIN = 10;
  const DISPLAY_VECTOR_NODE_CENTER_Y = -13;

  // strings
  const selectAVectorString = require( 'string!VECTOR_ADDITION/selectAVector' );
  const inspectAVectorString = require( 'string!VECTOR_ADDITION/inspectAVector' );
  const xString = require( 'string!VECTOR_ADDITION/x' );
  const yString = require( 'string!VECTOR_ADDITION/y' );


  class VectorDisplayPanel extends Panel {

    /**
     * @param {ObservableArray.<VectorModel>} vectors
     * @param {Graph} graph
     * @param {Object} [options]
     */
    constructor( vectors, graph, options ) {

      options = _.extend( VECTOR_PANEL_OPTIONS, options );

      // node that is passed to the superclass (panel)
      const contentNode = new Node();


      // create a button node to collapse/expand the panel
      const expandCollapseButton = new ExpandCollapseButton( options.expandedProperty, {
        sideLength: 21
      } );

      const inspectVectorText = new Text( inspectAVectorString, { font: new PhetFont( 16 ) } );

      const selectVectorText = new Text( selectAVectorString, { font: new PhetFont( 16 ) } );

      // create a scenery node that contains the nodes that display the vector
      // attributes (ie. angle, x and y components, magnitude)
      const displayVectorNode = new LayoutBox( {
        spacing: 15,
        orientation: 'horizontal',
        children: [ selectVectorText ]
      } );

      // layout the scenery nodes
      expandCollapseButton.left = EXPAND_COLLAPSE_BUTTON_LEFT_MARGIN;
      expandCollapseButton.centerY = EXPAND_COLLAPSE_BUTTON_CENTER_Y;
      inspectVectorText.left = expandCollapseButton.right + INSPECT_VECTOR_TEXT_LEFT_MARGIN;
      inspectVectorText.centerY = EXPAND_COLLAPSE_BUTTON_CENTER_Y;
      selectVectorText.left = inspectVectorText.left;
      selectVectorText.centerY = DISPLAY_VECTOR_NODE_CENTER_Y;
      displayVectorNode.left = inspectVectorText.left;
      displayVectorNode.centerY = DISPLAY_VECTOR_NODE_CENTER_Y;

      // set the children of the content node to be passed to the super class
      contentNode.setChildren( [
        expandCollapseButton,
        inspectVectorText,
        displayVectorNode
      ] );


      super( contentNode, options );

      // @private {LayoutBox} displayVectorNode - create a reference to the layout box
      this.displayVectorNode = displayVectorNode;

      // expand/collapse
      const expandedObserver = ( expanded ) => {
        displayVectorNode.visible = expanded;
        inspectVectorText.visible = !expanded;
        // TODO: toggle the selectVectorText visibility
      };

      options.expandedProperty.link( expandedObserver );

      this.linkVectorToPanel( graph.vectorSum );

      vectors.forEach( ( vectorModel ) => {
        this.linkVectorToPanel( vectorModel );
      } );

      vectors.addItemAddedListener( ( addedVector ) => {
        this.linkVectorToPanel( addedVector );
      } );
    }

    /**
     * Add a link so when a vector is dragged, the panel content updates as well
     * @param {VectorModel} vectorModelto be linked
     * @private
     */
    linkVectorToPanel( vectorModel ) {
      vectorModel.isDraggingProperty.link( ( isDragging ) => {
        if ( isDragging ) {

          const magnitudeTextNode = new FormulaNode( '\|\\mathbf{\\vec{' + vectorModel.label + '}\}|' );
          const magnitudeDisplay = new NumberDisplay(
            vectorModel.magnitudeProperty,
            new Range( 0, 100 ),
            { decimalPlaces: 1 }
          );

          const angleText = new RichText( MathSymbols.THETA );
          const angleDisplay = new NumberDisplay(
            vectorModel.angleDegreesProperty,
            new Range( -180, 180 ),
            { decimalPlaces: 1 }
          );

          const xComponentText = new RichText( `${vectorModel.label}<sub>${xString}</sub>` );
          const xComponentDisplay = new NumberDisplay(
            vectorModel.xProperty,
            new Range( -60, 60 ),
            { decimalPlaces: 0 }
          );

          const yComponentText = new RichText( `${vectorModel.label}<sub>${yString}</sub>` );
          const yComponentDisplay = new NumberDisplay(
            vectorModel.yProperty,
            new Range( -40, 40 ),
            { decimalPlaces: 0 }
          );

          this.displayVectorNode.setChildren( [
            new LayoutBox( {
              orientation: 'horizontal',
              spacing: 8,
              children: [ magnitudeTextNode, magnitudeDisplay ]
            } ),
            new LayoutBox( {
              orientation: 'horizontal',
              spacing: 8,
              children: [ angleText, angleDisplay ]
            } ),
            new LayoutBox( {
              orientation: 'horizontal',
              spacing: 8,
              children: [ xComponentText, xComponentDisplay ]
            } ),
            new LayoutBox( {
              orientation: 'horizontal',
              spacing: 8,
              children: [ yComponentText, yComponentDisplay ]
            } )
          ] );
        }
      } );


    }
  }


  return vectorAddition.register( 'VectorDisplayPanel', VectorDisplayPanel );
} );

