// Copyright 2019, University of Colorado Boulder

/**
 * Shows a Scenery Node that display the numerical magnitude, angle and components of a vector
 *
 * @author Martin Veillette
 * */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorDisplayNode extends Panel {

    /**
     * @param {ObservableArray.<Vector>} vectors
     * @param {Object} [options]
     * */
    constructor( vectors, options ) {


      options = _.extend( {

        // expand/collapse button
        expandedProperty: new BooleanProperty( false ) // {Property.<boolean>}

      }, options );

      // TODO generalize to active vector
      const vector = vectors.get( 0 );

      const expandCollapseButton = new ExpandCollapseButton( options.expandedProperty );

      const magnitudeText = new FormulaNode( '\|\\mathbf{\\vec{a}\}|' );
      const angleText = new RichText( 'Θ' );
      const xText = new RichText( 'S<sub>x</sub>' );
      const yText = new RichText( 'S<sub>y</sub>' );
      const magnitudeDisplay = new NumberDisplay( vector.magnitudeProperty, new Range( 0, 100 ), { decimalPlaces: 1 } );
      const angleDisplay = new NumberDisplay( vector.angleProperty, new Range( -180, 180 ), { decimalPlaces: 1 } );
      const xDisplay = new NumberDisplay( vector.xProperty, new Range( -60, 60 ), { decimalPlaces: 0 } );
      const yDisplay = new NumberDisplay( vector.yProperty, new Range( 40, 40 ), { decimalPlaces: 0 } );


      const displayVectorNode = new LayoutBox( {
        orientation: 'horizontal',
        spacing: 20,
        children: [ magnitudeText, magnitudeDisplay, angleText, angleDisplay, xText, xDisplay, yText, yDisplay ]
      } );

      const inspectVectorText = new Text( 'Inspect Vector', { font: new PhetFont( 20 ) } );

      const contentNode = new Node();

      contentNode.addChild( displayVectorNode );
      contentNode.addChild( inspectVectorText );
      contentNode.addChild( expandCollapseButton );

      displayVectorNode.left = expandCollapseButton.right + 10;
      inspectVectorText.left = expandCollapseButton.right + 10;

      inspectVectorText.centerY = expandCollapseButton.centerY;
      displayVectorNode.centerY = expandCollapseButton.centerY;

      super( contentNode, options );

      // expand/collapse
      const expandedObserver = ( expanded ) => {
        displayVectorNode.visible = expanded;
        inspectVectorText.visible = !expanded;
      };

      options.expandedProperty.link( expandedObserver );
    }
  }


  return vectorAddition.register( 'VectorDisplayNode', VectorDisplayNode );
} );

